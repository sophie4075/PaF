package com.example.Rentify.scheduler;

import com.example.Rentify.service.RentalService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RentalStatusScheduler {

    private final RentalService rentalService;

    public RentalStatusScheduler(RentalService rentalService) {
        this.rentalService = rentalService;

    }

    // Every day at Midnight
    @Scheduled(cron = "0 0 0 * * ?", zone = "Europe/Berlin")
    public void scheduleDailyOverdueCheck() {
        rentalService.checkAndUpdateOverdueRentals();
    }

    @Scheduled(cron = "0 0 0 * * ?", zone = "Europe/Berlin")
    public void updateArticleInstanceStatus() {
       rentalService.changeAvailableToRented();
    }
}