package com.example.Rentify.service;

import com.example.Rentify.dto.RentalDto;
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
public class RentalService {
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
    public RentalService(RentalRepo rentalRepo,
                         RentalPositionRepo rentalPositionRepo,
                         ArticleInstanceRepo articleInstanceRepo,
                         ApplicationEventPublisher eventPublisher) {
        this.rentalRepo = rentalRepo;
        this.rentalPositionRepo = rentalPositionRepo;
        this.articleInstanceRepo = articleInstanceRepo;
        this.eventPublisher = eventPublisher;
    }

    public RentalDto getRentalById(Long id) {
        Rental rental = rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rental.getId());

        return RentalMapper.toDTO(rental, rentalPositions);
    }

    public List<RentalDto> getAllRentals() {
        List<Rental> rentals = (List<Rental>) rentalRepo.findAll();

        return rentals.stream().map(rental -> {
            List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rental.getId());
            return RentalMapper.toDTO(rental, rentalPositions);
        }).collect(Collectors.toList());
    }

    public List<Rental> getRentalsByUserId(Long userId) {
        return rentalRepo.findByUserId(userId);
    }

    public List<RentalPosition> getAllRentalPositions() {
        return rentalPositionRepo.findAll();
    }

    public RentalDto updateRental(Long id, Rental updatedRental) {
        Rental existingRental = rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        existingRental.setRentalStatus(updatedRental.getRentalStatus());

        rentalRepo.save(existingRental);

        return getRentalById(id);
    }

    public void deleteRental(Long id) {
        if (!rentalRepo.existsById(id)) {
            throw new IllegalArgumentException("Rental with ID " + id + " not found");
        }
        rentalRepo.deleteById(id);
    }

    public BigDecimal calculateTotalPrice(Long rentalId) {
        List<RentalPosition> rentalPositions = rentalPositionRepo.findByRentalId(rentalId);

        return rentalPositions.stream()
                .map(pos -> pos.getPositionPrice() == null ? BigDecimal.ZERO : pos.getPositionPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    public void createRental(Rental rental, Article article, LocalDate rentalStart, LocalDate rentalEnd, int quantity) {
        List<ArticleInstance> allInstances = articleInstanceRepo.findByArticle(article);

        List<ArticleInstance> availableInstances = allInstances.stream()
                .filter(instance -> instance.getStatus() == Status.AVAILABLE)
                .filter(instance -> !rentalPositionRepo.existsByArticleInstanceAndRentalPeriodOverlap(instance, rentalStart, rentalEnd))
                .toList();

        if (availableInstances.size() < quantity) {
            throw new IllegalArgumentException("Nicht genügend Instanzen verfügbar für Artikel " + article.getId() +
                    ". Gewünscht: " + quantity + ", verfügbar: " + availableInstances.size());
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
}



