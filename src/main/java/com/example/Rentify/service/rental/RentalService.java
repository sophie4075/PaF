package com.example.Rentify.service.rental;

import com.example.Rentify.dto.AdminRentalInfoDto;
import com.example.Rentify.dto.CustomerRentalDto;
import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.dto.RentalPositionDto;
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
    List<AdminRentalInfoDto> getCurrentRentals();
    List<AdminRentalInfoDto> getDueRentals();
    List<AdminRentalInfoDto> getUpcomingUnderRepairRentals();
    AdminRentalInfoDto updateRentalPeriod(Long rentalPositionId, RentalPositionDto updateDto);
    AdminRentalInfoDto updateInstanceStatus(Long rentalPositionId, String newStatusStr);
    List<AdminRentalInfoDto> getUnderRepairInstancesSorted();

    List<AdminRentalInfoDto> getOverDueRentals();

    List<AdminRentalInfoDto> getAllRentalPos();

    void updateInstanceStatusByInventoryNo(String inventoryNumber, String newStatus);

    List<CustomerRentalDto> getRentalPositionsForUser(Long userId);

    CustomerRentalDto updateRentalPeriodForCustomer(Long rentalPositionId, RentalPositionDto updateDto, Long id);

    void deleteRentalPositionForCustomer(Long rentalPositionId, Long id);
}

