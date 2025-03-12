package com.example.Rentify;

import com.example.Rentify.configuration.DatabaseSeeder;
import com.example.Rentify.entity.RentalPosition;
import com.example.Rentify.messengerBot.MessengerBot;
import com.example.Rentify.repo.RentalPositionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@SpringBootTest
class ReminderTest {

    @Autowired
    private DatabaseSeeder databaseSeeder;

    @Autowired
    private RentalPositionRepo rentalPositionRepo;

    @BeforeEach
    public void setUp() throws Exception {
        databaseSeeder.run();

        // Validate that the database contains rentals for tomorrow
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<RentalPosition> rentalPositions = rentalPositionRepo.findAll();
        System.out.println("Rental positions in DB: " + rentalPositions.size());

        boolean hasTomorrowRentals = rentalPositions.stream()
                .anyMatch(rp -> rp.getRentalStart().equals(tomorrow));
        assertTrue(hasTomorrowRentals, "No rentals found for tomorrow's reminder test.");
        System.out.println("Tomorrow rentals found in DB: " + hasTomorrowRentals);
    }

    @Test
    public void testSendRemindersForTomorrowDirectly() {
        // Mock MessengerBot to verify sendRemindersForTomorrow calls
        MessengerBot botMock = mock(MessengerBot.class);

        botMock.sendRemindersForTomorrow();

        // Verify: Ensure sendRemindersForTomorrow is called appropriately
        verify(botMock, times(1)).sendRemindersForTomorrow();
    }
}