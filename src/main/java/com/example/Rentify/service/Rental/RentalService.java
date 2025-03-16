package com.example.Rentify.service.Rental;

import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.RentalPosition;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface RentalService {


    RentalDto getRentalById(Long id);
    List<RentalDto> getAllRentals();
    List<Rental> getRentalsByUserId(Long userId);
    List<RentalPosition> getAllRentalPositions();
    RentalDto updateRental(Long id, Rental updatedRental);
    void deleteRental(Long id);
    BigDecimal calculateTotalPrice(Long rentalId);
    void checkAndUpdateOverdueRentals();
    void changeAvailableToRented();
    void createRental(Rental rental, Article article, LocalDate rentalStart, LocalDate rentalEnd, int quantity);
}

