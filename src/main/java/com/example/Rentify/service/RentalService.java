package com.example.Rentify.service;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.User;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.repo.RentalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * The RentalService class provides business logic for rental-related operations.
 * An event is published after a rental is created. An EmailNotificationListener
 * (implementiert als Observer) reagiert auf dieses Event und versendet eine E-Mail.
 */
@Service
public class RentalService {
    private final RentalRepo rentalRepo;
    private final ApplicationEventPublisher eventPublisher;
    private final UserService userService;

    /**
     * Constructor for injecting the Rental repository and ApplicationEventPublisher.
     *
     * @param rentalRepo      Rental repository.
     * @param eventPublisher  ApplicationEventPublisher for publishing events.
     */
    @Autowired
    public RentalService(RentalRepo rentalRepo, ApplicationEventPublisher eventPublisher, UserService userService) {
        this.rentalRepo = rentalRepo;
        this.eventPublisher = eventPublisher;
        this.userService = userService;
    }

    /**
     * Creates a new rental, calculates the total price, saves it, and publishes an event.
     *
     * @param rental the rental entity to create.
     * @return the saved rental.
     */
    public Rental createRental(Rental rental) {

        /*Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        rental.setUser(currentUser);*/


        if (rental.getRentalPositions() != null) {
            rental.getRentalPositions().forEach(pos -> pos.setRental(rental));
        }

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
}
