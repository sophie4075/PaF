package com.example.Rentify.scheduler;

import com.example.Rentify.service.rental.RentalServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RentalStatusScheduler {

    private final RentalServiceImpl rentalServiceImpl;

    public RentalStatusScheduler(RentalServiceImpl rentalServiceImpl) {
        this.rentalServiceImpl = rentalServiceImpl;

    }

    // Every day at Midnight
    @Scheduled(cron = "0 0 0 * * ?", zone = "Europe/Berlin")
    public void scheduleDailyOverdueCheck() {
        rentalServiceImpl.checkAndUpdateOverdueRentals();
    }

    @Scheduled(cron = "0 0 0 * * ?", zone = "Europe/Berlin")
    public void updateArticleInstanceStatus() {
       rentalServiceImpl.changeAvailableToRented();
    }
}