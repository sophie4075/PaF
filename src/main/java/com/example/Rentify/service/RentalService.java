package com.example.Rentify.service;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.repo.RentalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * The RentalService class provides business logic for rental-related operations.
 * An event is published after a rental is created. An EmailNotificationListener,
 * implemented as an Observer, reacts to this event and sends an email.
 */
@Service
public class RentalService {
    private final RentalRepo rentalRepo;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Constructor for injecting the Rental repository and ApplicationEventPublisher.
     *
     * @param rentalRepo      Rental repository.
     * @param eventPublisher  ApplicationEventPublisher for publishing events.
     */
    @Autowired
    public RentalService(RentalRepo rentalRepo, ApplicationEventPublisher eventPublisher) {
        this.rentalRepo = rentalRepo;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Creates a new rental, calculates the total price, saves it, and publishes an event.
     *
     * @param rental the rental entity to create.
     * @return the saved rental.
     */
    public Rental createRental(Rental rental) {
        rental.setTotalPrice(calculateTotalPrice(rental));
        Rental savedRental = rentalRepo.save(rental);

        eventPublisher.publishEvent(new RentalCreatedEvent(savedRental));

        return savedRental;
    }

    public Rental updateRental(Long id, Rental updatedRental) {
        Rental existingRental = rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        existingRental.setRentalStatus(updatedRental.getRentalStatus());
        existingRental.setTotalPrice(calculateTotalPrice(updatedRental));
        if (updatedRental.getRentalPositions() != null) {
            existingRental.setRentalPositions(updatedRental.getRentalPositions());
        }

        return rentalRepo.save(existingRental);
    }

    public void deleteRental(Long id) {
        if (!rentalRepo.existsById(id)) {
            throw new IllegalArgumentException("Rental with ID " + id + " not found");
        }
        rentalRepo.deleteById(id);
    }

    public List<Rental> getAllRentals() {
        return (List<Rental>) rentalRepo.findAll();
    }

    public Rental getRentalById(Long id) {
        return rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));
    }

    private BigDecimal calculateTotalPrice(Rental rental) {
        return rental.getRentalPositions().stream()
                .map(pos -> pos.getPositionPrice() == null ? BigDecimal.ZERO : pos.getPositionPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<Rental> getRentalsByUserId(Long userId) {
        return rentalRepo.findByUserId(userId);
    }
}
