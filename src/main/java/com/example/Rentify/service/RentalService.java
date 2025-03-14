package com.example.Rentify.service;

import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.entity.*;
import com.example.Rentify.mapper.RentalMapper;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.RentalPositionRepo;
import com.example.Rentify.repo.RentalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalService {
    private final RentalRepo rentalRepo;
    private final RentalPositionRepo rentalPositionRepo;
    private final ArticleInstanceRepo articleInstanceRepo;
    private final ApplicationEventPublisher eventPublisher;

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

    /*public RentalDto createRental(Rental rental, List<RentalPosition> rentalPositions) {

        Rental savedRental = rentalRepo.save(rental);

        for (RentalPosition position : rentalPositions) {
            position.setRental(savedRental);

            Long articleInstanceId = position.getArticleInstance().getId();
            var articleInstance = articleInstanceRepo.findById(articleInstanceId)
                    .orElseThrow(() -> new IllegalArgumentException("ArticleInstance not found with id: " + articleInstanceId));
            position.setArticleInstance(articleInstance);

            long days = ChronoUnit.DAYS.between(position.getRentalStart(), position.getRentalEnd());

            BigDecimal dailyPrice = BigDecimal.valueOf(articleInstance.getArticle().getGrundpreis());
            BigDecimal positionPrice = dailyPrice.multiply(BigDecimal.valueOf(days));
            position.setPositionPrice(positionPrice);
        }
        rentalPositionRepo.saveAll(rentalPositions);

        BigDecimal totalPrice = calculateTotalPrice(savedRental.getId());
        savedRental.setTotalPrice(totalPrice);
        rentalRepo.save(savedRental);

        //TODO remove comment, make eventPublisher available
        //eventPublisher.publishEvent(new RentalCreatedEvent(savedRental));

        List<RentalPosition> savedRentalPositions = rentalPositionRepo.findByRentalId(savedRental.getId());

        return RentalMapper.toDTO(savedRental, savedRentalPositions);


    }*/

/*
    public RentalDto createRental(Rental rental, Article article, LocalDate rentalStart, LocalDate rentalEnd, int quantity) {
        Rental savedRental = rentalRepo.save(rental);

        List<ArticleInstance> allInstances = articleInstanceRepo.findByArticle(article);
        // Filtere verfügbare Instanzen
        List<ArticleInstance> availableInstances = allInstances.stream()
                .filter(instance -> instance.getStatus() == Status.AVAILABLE)
                .filter(instance -> !rentalPositionRepo.existsByArticleInstanceAndRentalPeriodOverlap(instance, rentalStart, rentalEnd))
                .toList();

        if (availableInstances.size() < quantity) {
            throw new IllegalArgumentException("Nicht genügend Instanzen verfügbar. Gewünscht: " + quantity +
                    ", verfügbar: " + availableInstances.size());
        }

        // Erstelle RentalPositionen für die ersten 'quantity' Instanzen
        for (int i = 0; i < quantity; i++) {
            ArticleInstance selectedInstance = availableInstances.get(i);
            RentalPosition position = new RentalPosition();
            position.setRental(savedRental);
            position.setArticleInstance(selectedInstance);
            position.setRentalStart(rentalStart);
            position.setRentalEnd(rentalEnd);

            long days = ChronoUnit.DAYS.between(rentalStart, rentalEnd);
            days = days <= 0 ? 1 : days;
            BigDecimal dailyPrice = BigDecimal.valueOf(selectedInstance.getArticle().getGrundpreis());
            BigDecimal positionPrice = dailyPrice.multiply(BigDecimal.valueOf(days));
            position.setPositionPrice(positionPrice);

            rentalPositionRepo.save(position);
        }

        BigDecimal totalPrice = calculateTotalPrice(savedRental.getId());
        savedRental.setTotalPrice(totalPrice);
        rentalRepo.save(savedRental);

        List<RentalPosition> savedPositions = rentalPositionRepo.findByRentalId(savedRental.getId());
        return RentalMapper.toDTO(savedRental, savedPositions);
    }
*/


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

    public void addRentalPositionsForArticle(Rental rental, Article article, LocalDate rentalStart, LocalDate rentalEnd, int quantity) {
        List<ArticleInstance> allInstances = articleInstanceRepo.findByArticle(article);

        List<ArticleInstance> availableInstances = allInstances.stream()
                .filter(instance -> instance.getStatus() == Status.AVAILABLE)
                .filter(instance -> !rentalPositionRepo.existsByArticleInstanceAndRentalPeriodOverlap(instance, rentalStart, rentalEnd))
                .toList();

        if (availableInstances.size() < quantity) {
            throw new IllegalArgumentException("Nicht genügend Instanzen verfügbar für Artikel " + article.getId() +
                    ". Gewünscht: " + quantity + ", verfügbar: " + availableInstances.size());
        }

        // Erstelle RentalPositionen für die ersten 'quantity' verfügbaren Instanzen
        for (int i = 0; i < quantity; i++) {
            ArticleInstance selectedInstance = availableInstances.get(i);
            RentalPosition position = new RentalPosition();
            position.setRental(rental);
            position.setArticleInstance(selectedInstance);
            position.setRentalStart(rentalStart);
            position.setRentalEnd(rentalEnd);

            long days = ChronoUnit.DAYS.between(rentalStart, rentalEnd);
            days = days <= 0 ? 1 : days;
            BigDecimal dailyPrice = BigDecimal.valueOf(selectedInstance.getArticle().getGrundpreis());
            BigDecimal positionPrice = dailyPrice.multiply(BigDecimal.valueOf(days));
            position.setPositionPrice(positionPrice);

            rentalPositionRepo.save(position);
        }
    }

}



