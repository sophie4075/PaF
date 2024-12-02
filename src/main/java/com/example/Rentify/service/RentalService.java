package com.example.Rentify.service;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.repo.RentalRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RentalService {
    private final RentalRepo rentalRepo;

    public RentalService(RentalRepo rentalRepo) {
        this.rentalRepo = rentalRepo;
    }

    public Rental createRental(Rental rental) {
        rental.setTotalPrice(calculateTotalPrice(rental));
        return rentalRepo.save(rental);
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
