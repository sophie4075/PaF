package com.example.Rentify;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.RentalStatus;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.RentalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.timeout;

@SpringBootTest
public class RentalServiceIntegrationTest {

    @Autowired
    private RentalService rentalService;

    @Autowired
    private UserRepo userRepo;

    @MockBean
    private com.example.Rentify.email.EmailService emailService;

    @Test
    public void testRentalCreationTriggersEmail() {
        User testuser = new User();
        testuser.setFirstName("Max");
        testuser.setLastName("Mustermann");
        testuser.setEmail("max.mustermann@example.com");

        User savedUser = userRepo.save(testuser);

        Rental rental = new Rental();
        rental.setUser(savedUser);
        rental.setTotalPrice(new BigDecimal("100.00"));
        rental.setRentalStatus(RentalStatus.ACTIVE);
        rental.setRentalPositions(Collections.emptyList());

        // Löst die Erstellung der Ausleihe aus; es wird ein RentalCreatedEvent publiziert.
        rentalService.createRental(rental);

        // Überprüfung, dass der EmailService zum Versand einer E-Mail aufgerufen wurde.
        verify(emailService, timeout(1000)).sendEmail(
                eq("max.mustermann@example.com"),
                eq("Neue Ausleihe erstellt"),
                contains("Deine Ausleihe wurde erfolgreich erstellt"));
    }
}
