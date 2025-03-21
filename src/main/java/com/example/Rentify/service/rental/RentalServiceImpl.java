package com.example.Rentify.service.rental;

import com.example.Rentify.dto.AdminRentalInfoDto;
import com.example.Rentify.dto.CustomerRentalDto;
import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.dto.RentalPositionDto;
import com.example.Rentify.entity.*;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.mapper.RentalMapper;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.RentalPositionRepo;
import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.RentalPosition;
import com.example.Rentify.repo.RentalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The RentalService class provides business logic for rental-related operations.
 */
@Service
public class RentalServiceImpl implements RentalService {
    private final RentalRepo rentalRepo;
    private final RentalPositionRepo rentalPositionRepo;
    private final ArticleInstanceRepo articleInstanceRepo;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Constructor for injecting the Rental repository and ApplicationEventPublisher.
     *
     * @param rentalRepo      Rental repository.
     * @param rentalPositionRepo Rental position repository.
     * @param eventPublisher  ApplicationEventPublisher for publishing events.
     */
    @Autowired
    public RentalServiceImpl(RentalRepo rentalRepo,
                             RentalPositionRepo rentalPositionRepo,
                             ArticleInstanceRepo articleInstanceRepo,
                             ApplicationEventPublisher eventPublisher) {
        this.rentalRepo = rentalRepo;
        this.rentalPositionRepo = rentalPositionRepo;
        this.articleInstanceRepo = articleInstanceRepo;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public RentalDto getRentalById(Long id) {
        Rental rental = rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rental.getId());

        return RentalMapper.toDTO(rental, rentalPositions);
    }

    @Override
    public List<RentalDto> getAllRentals() {
        List<Rental> rentals = (List<Rental>) rentalRepo.findAll();

        return rentals.stream().map(rental -> {
            List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rental.getId());
            return RentalMapper.toDTO(rental, rentalPositions);
        }).collect(Collectors.toList());
    }

    @Override
    public List<Rental> getRentalsByUserId(Long userId) {
        return rentalRepo.findByUserId(userId);
    }

    @Override
    public List<RentalPosition> getAllRentalPositions() {
        return rentalPositionRepo.findAll();
    }

    @Override
    public RentalDto updateRental(Long id, Rental updatedRental) {
        Rental existingRental = rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        existingRental.setRentalStatus(updatedRental.getRentalStatus());

        rentalRepo.save(existingRental);

        return getRentalById(id);
    }

    @Override
    public void deleteRental(Long id) {
        if (!rentalRepo.existsById(id)) {
            throw new IllegalArgumentException("Rental with ID " + id + " not found");
        }
        rentalRepo.deleteById(id);
    }

    @Override
    public BigDecimal calculateTotalPrice(Long rentalId) {
        List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rentalId);

        return rentalPositions.stream()
                .map(pos -> pos.getPositionPrice() == null ? BigDecimal.ZERO : pos.getPositionPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public void checkAndUpdateOverdueRentalPos() {
        LocalDate today = LocalDate.now();
        List<RentalPosition> rentals = rentalPositionRepo.findAll();
        System.out.println("Checking for overdue articleInstances");

        for (RentalPosition rental : rentals) {

            if (rental.getRentalEnd().isBefore(today)) {
                ArticleInstance instance = rental.getArticleInstance();
                if (instance.getStatus() != Status.OVERDUE && instance.getStatus() == Status.RENTED) {
                    instance.setStatus(Status.OVERDUE);
                    articleInstanceRepo.save(instance);
                    System.out.println("ArticleInstance " + instance.getId() + " set to OVER_DUE");
                }
            } else {
                // TODO if state == returned auto set available?
                System.out.println("Rental " + rental.getId() + " is not overdue");
            }
        }
    }

    @Override
    public void changeAvailableToRented(){
        LocalDate today = LocalDate.now();
        List<RentalPosition> activeRentalPositions = rentalPositionRepo.findByRentalStartLessThanEqualAndRentalEndGreaterThanEqual(today, today);
        for (RentalPosition rp : activeRentalPositions) {
            ArticleInstance instance = rp.getArticleInstance();
            if (instance.getStatus() == Status.AVAILABLE) {
                instance.setStatus(Status.RENTED);
                articleInstanceRepo.save(instance);
            }
        }
    }

    @Override
    public void createRental(Rental rental, Article article, LocalDate rentalStart, LocalDate rentalEnd, int quantity) {
        List<ArticleInstance> allInstances = articleInstanceRepo.findByArticle(article);

        List<ArticleInstance> availableInstances = allInstances.stream()
                .filter(instance -> instance.getStatus() != Status.RETIRED && instance.getStatus() != Status.UNDER_REPAIR)
                .filter(instance -> !rentalPositionRepo.existsByArticleInstanceAndRentalPeriodOverlap(instance, rentalStart, rentalEnd))
                .toList();

        if (availableInstances.size() < quantity) {
            throw new IllegalArgumentException("Not enough instances available for article " + article.getId() +
                    ". Requested: " + quantity + ", available: " + availableInstances.size());
        }

        rental = rentalRepo.save(rental);

        for (int i = 0; i < quantity; i++) {
            ArticleInstance selectedInstance = availableInstances.get(i);
            RentalPosition position = new RentalPosition();
            position.setRental(rental);
            position.setArticleInstance(selectedInstance);
            position.setRentalStart(rentalStart);
            position.setRentalEnd(rentalEnd);

            long days = ChronoUnit.DAYS.between(rentalStart, rentalEnd);
            days = Math.max(days, 1);
            BigDecimal dailyPrice = BigDecimal.valueOf(selectedInstance.getArticle().getGrundpreis());
            BigDecimal positionPrice = dailyPrice.multiply(BigDecimal.valueOf(days));
            position.setPositionPrice(positionPrice);

            rentalPositionRepo.save(position);
        }
        rental.setTotalPrice(calculateTotalPrice(rental.getId()));
        rentalRepo.save(rental);

        eventPublisher.publishEvent(new RentalCreatedEvent(rental));
    }

    @Override
    public List<AdminRentalInfoDto> getCurrentRentalPos() {
        LocalDate now = LocalDate.now();
        return rentalPositionRepo.findCurrentRentalInfo(now);
    }

    @Override
    public List<AdminRentalInfoDto> getDueRentalPos() {
        LocalDate now = LocalDate.now();
        return rentalPositionRepo.findDueRentalInfo(now);
    }

    @Override
    public List<AdminRentalInfoDto> getUpcomingUnderRepairRentalPos() {
        LocalDate now = LocalDate.now();
        LocalDate sevenDaysLater = now.plusDays(7);
        return rentalPositionRepo.findUpcomingUnderRepairRentalInfo(now, sevenDaysLater);
    }

    @Override
    public AdminRentalInfoDto updateRentalPosPeriod(Long rentalPositionId, RentalPositionDto updateDto){
        RentalPosition rentalPosition = rentalPositionRepo.findById(rentalPositionId)
                .orElseThrow(() -> new IllegalArgumentException("RentalPosition not found"));

        LocalDate currentStart = rentalPosition.getRentalStart();
        LocalDate newEnd = updateDto.getRentalEnd();

        boolean overlapExists = rentalPositionRepo.existsOverlapExcludingCurrent(
                rentalPosition.getArticleInstance(),
                rentalPosition.getId(),
                rentalPosition.getRentalEnd(),
                newEnd
        );
        if (overlapExists) {
            throw new IllegalStateException("Overlap with another rental");
        }

        // Update Dates & Price
        rentalPosition.setRentalEnd(newEnd);
        long days = ChronoUnit.DAYS.between(currentStart, newEnd);
        days = Math.max(days, 1);
        BigDecimal dailyPrice = BigDecimal.valueOf(rentalPosition.getArticleInstance().getArticle().getGrundpreis());
        rentalPosition.setPositionPrice(dailyPrice.multiply(BigDecimal.valueOf(days)));

        rentalPositionRepo.save(rentalPosition);

        // Update Rental
        Rental rental = rentalPosition.getRental();
        BigDecimal totalPrice = calculateTotalPrice(rental.getId());
        rental.setTotalPrice(totalPrice);
        rentalRepo.save(rental);

        return new AdminRentalInfoDto(
                rentalPosition.getId(),
                currentStart,
                newEnd,
                rentalPosition.getPositionPrice(),
                rental.getUser().getEmail(),
                rental.getUser().getId(),
                rental.getUser().getFirstName(),
                rental.getUser().getLastName(),
                rentalPosition.getArticleInstance().getArticle().getBezeichnung(),
                rentalPosition.getArticleInstance().getInventoryNumber(),
                rentalPosition.getArticleInstance().getStatus()
        );
    }


    @Override
    public AdminRentalInfoDto updateInstanceStatus(Long rentalPositionId, String newStatusStr) {
        if(newStatusStr == null) {
            throw new IllegalArgumentException("newStatus cannot be null");
        }
        Status newStatus = Status.valueOf(newStatusStr);
        RentalPosition rentalPosition = rentalPositionRepo.findById(rentalPositionId)
                .orElseThrow(() -> new IllegalArgumentException("RentalPosition not found"));

        ArticleInstance instance = rentalPosition.getArticleInstance();
        instance.setStatus(newStatus);
        articleInstanceRepo.save(instance);


        return new AdminRentalInfoDto(
                rentalPosition.getId(),
                rentalPosition.getRentalStart(),
                rentalPosition.getRentalEnd(),
                rentalPosition.getPositionPrice(),
                rentalPosition.getRental().getUser().getEmail(),
                rentalPosition.getRental().getUser().getId(),
                rentalPosition.getRental().getUser().getFirstName(),
                rentalPosition.getRental().getUser().getLastName(),
                rentalPosition.getArticleInstance().getArticle().getBezeichnung(),
                rentalPosition.getArticleInstance().getInventoryNumber(),
                instance.getStatus()
        );
    }

    @Override
    public List<AdminRentalInfoDto> getUnderRepairInstancesSorted() {
        /*List<AdminRentalInfoDto> result = articleInstanceRepo.findUnderRepairSortedByUpcomingRental(LocalDate.now());
        System.out.println("Result size: " + result.size());
        result.forEach(dto -> System.out.println(dto.getArticleInstanceInventoryNumber() + " | " + dto.getUserEmail()));*/
        return articleInstanceRepo.findUnderRepairSortedByUpcomingRental(LocalDate.now());
    }

    @Override
    public List<AdminRentalInfoDto> getOverDueRentalPos() {
        return articleInstanceRepo.getOverDue();
    }

    @Override
    public List<AdminRentalInfoDto> getAllRentalPos() {
       return rentalPositionRepo.findAllRentalPosAsDto();
    }

    @Override
    public void updateInstanceStatusByInventoryNo(String inventoryNumber, String newStatusStr) {
        if (newStatusStr == null) {
            throw new IllegalArgumentException("newStatus cannot be null");
        }

        Status newStatus = Status.valueOf(newStatusStr);

        ArticleInstance instance = articleInstanceRepo.findByInventoryNumber(inventoryNumber)
                .orElseThrow(() -> new IllegalArgumentException("Instance not found"));

        instance.setStatus(newStatus);
        articleInstanceRepo.save(instance);
    }

    @Override
    public List<CustomerRentalDto> getRentalPositionsForUser(Long userId) {
        return rentalPositionRepo.findRentalInfoByUserId(userId);
    }

    @Override
    public CustomerRentalDto updateRentalPeriodForCustomer(Long rentalPositionId, RentalPositionDto updateDto, Long userId) {
        RentalPosition rentalPosition = rentalPositionRepo.findById(rentalPositionId)
                .orElseThrow(() -> new IllegalArgumentException("RentalPosition not found"));

        if (!rentalPosition.getRental().getUser().getId().equals(userId)) {
            throw new SecurityException("Access denied: Not your rental position");
        }

        LocalDate today = LocalDate.now();
        if (!rentalPosition.getRentalStart().isAfter(today)) {
            throw new IllegalStateException("Cannot update rental that has already started");
        }

        LocalDate newStart = updateDto.getRentalStart();
        LocalDate newEnd = updateDto.getRentalEnd();

        boolean overlapExists = rentalPositionRepo.existsOverlapExcludingCurrent(
                rentalPosition.getArticleInstance(),
                rentalPosition.getId(),
                newStart,
                newEnd
        );
        if (overlapExists) {
            throw new IllegalStateException("Overlap with another rental");
        }

        rentalPosition.setRentalStart(newStart);
        rentalPosition.setRentalEnd(newEnd);
        long days = ChronoUnit.DAYS.between(newStart, newEnd);
        days = Math.max(days, 1);
        BigDecimal dailyPrice = BigDecimal.valueOf(rentalPosition.getArticleInstance().getArticle().getGrundpreis());
        rentalPosition.setPositionPrice(dailyPrice.multiply(BigDecimal.valueOf(days)));

        rentalPositionRepo.save(rentalPosition);

        Rental rental = rentalPosition.getRental();
        BigDecimal totalPrice = calculateTotalPrice(rental.getId());
        rental.setTotalPrice(totalPrice);
        rentalRepo.save(rental);

        return new CustomerRentalDto(
                rental.getId(),
                rentalPosition.getId(),
                rentalPosition.getArticleInstance().getArticle().getBezeichnung(),
                rentalPosition.getArticleInstance().getInventoryNumber(),
                newStart,
                newEnd,
                rentalPosition.getArticleInstance().getStatus().toString(),
                rentalPosition.getPositionPrice(),
                rental.getTotalPrice()
        );
    }


    @Override
    public void deleteRentalPositionForCustomer(Long rentalPositionId, Long userId) {
        RentalPosition rentalPosition = rentalPositionRepo.findById(rentalPositionId)
                .orElseThrow(() -> new IllegalArgumentException("RentalPosition not found"));

        if (!rentalPosition.getRental().getUser().getId().equals(userId)) {
            throw new SecurityException("Access denied");
        }

        LocalDate today = LocalDate.now();
        if (!rentalPosition.getRentalStart().isAfter(today)) {
            throw new IllegalStateException("Cannot delete position that already started");
        }

        rentalPositionRepo.delete(rentalPosition);
        Rental rental = rentalPosition.getRental();

        List<RentalPosition> remainingPositions = rentalPositionRepo.findByRentalId(rental.getId());


        if (remainingPositions.isEmpty()) {
            rental.setRentalStatus(RentalStatus.CANCELLED);
            rental.setTotalPrice(BigDecimal.ZERO);
        } else {
            BigDecimal totalPrice = calculateTotalPrice(rental.getId());
            rental.setTotalPrice(totalPrice);
        }


        rentalRepo.save(rental);
    }





}



