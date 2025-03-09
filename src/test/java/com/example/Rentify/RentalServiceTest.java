package com.example.Rentify;

import com.example.Rentify.entity.*;
import com.example.Rentify.service.ArticleService;
import com.example.Rentify.service.EmailService;
import com.example.Rentify.service.RentalService;
import com.example.Rentify.service.UserService;
import com.example.Rentify.service.article.ArticleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RentalServiceTest {

    @Autowired
    private RentalService rentalService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserService userService;

    @MockBean
    private EmailService emailService;

    private User testUser;
    private Article article1;
    private Article article2;
    @Autowired
    private ArticleServiceImpl articleServiceImpl;

    @BeforeEach
    void setup() {
        testUser = new User();
        testUser.setFirstName("Max");
        testUser.setLastName("Mustermann");
        testUser.setEmail("max@mustermann.com");
        testUser = userService.createUser(testUser);

        article1 = new Article();
        article1.setBezeichnung("Camera");
        article1.setBeschreibung("High-quality DSLR Camera");
        article1.setGrundpreis(50);
        article1 = articleService.createArticle(article1);

        article2 = new Article();
        article2.setBezeichnung("Tripod");
        article2.setBeschreibung("Professional-grade tripod");
        article2.setGrundpreis(30);
        article2 = articleService.createArticle(article2);
    }


    @Test
    public void testRentalWithMultiplePositionsIsCreated() {
        // Persist ArticleInstances before using them
        ArticleInstance articleInstance1 = new ArticleInstance();
        articleInstance1.setArticle(article1);
        articleInstance1 = articleServiceImpl.createArticleInstance(articleInstance1);

        ArticleInstance articleInstance2 = new ArticleInstance();
        articleInstance2.setArticle(article2);
        articleInstance2 = articleServiceImpl.createArticleInstance(articleInstance2);

        // Create RentalPositions
        RentalPosition position1 = new RentalPosition();
        position1.setRentalStart(LocalDate.of(2025, 3, 10));
        position1.setRentalEnd(LocalDate.of(2025, 3, 15));
        position1.setPositionPrice(new BigDecimal("50.00"));
        position1.setArticleInstance(articleInstance1);

        RentalPosition position2 = new RentalPosition();
        position2.setRentalStart(LocalDate.of(2025, 3, 12));
        position2.setRentalEnd(LocalDate.of(2025, 3, 20));
        position2.setPositionPrice(new BigDecimal("75.00"));
        position2.setArticleInstance(articleInstance2);

        // Create and Save Rental
        Rental rental = new Rental();
        rental.setUser(testUser);
        rental.setTotalPrice(new BigDecimal("125.00"));
        rental.setRentalStatus(RentalStatus.ACTIVE);
        rental.setRentalPositions(List.of(position1, position2));

        // Associate positions with rental
        position1.setRental(rental);
        position2.setRental(rental);

        Rental savedRental = rentalService.createRental(rental);

        // Assertions
        assertNotNull(savedRental.getId(), "Rental ID should not be null after saving.");
        assertEquals(testUser.getId(), savedRental.getUser().getId(), "Rental should be associated with the correct user.");
        assertEquals(2, savedRental.getRentalPositions().size(), "Rental should contain exactly 2 rental positions.");
        assertEquals(new BigDecimal("125.00"), savedRental.getTotalPrice(), "Total price should be correctly calculated.");

        // Ensure positions are persisted correctly
        savedRental.getRentalPositions().forEach(position ->
                assertNotNull(position.getId(), "RentalPosition ID should not be null after saving."));
    }
}