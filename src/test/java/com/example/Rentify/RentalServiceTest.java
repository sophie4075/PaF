package com.example.Rentify;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.entity.*;
import com.example.Rentify.service.RentalService;
import com.example.Rentify.service.UserService;
import com.example.Rentify.service.article.ArticleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Import(TestConfig.class)
public class RentalServiceTest {

    @Autowired
    private RentalService rentalService;

    @Autowired
    private ArticleServiceImpl articleServiceImpl; // ✅ Jetzt NUR `ArticleServiceImpl` verwenden

    @Autowired
    private UserService userService;

    private User testUser;
    private ArticleDto articleDto;

    @BeforeEach
    void setup() {
        testUser = new User();
        testUser.setFirstName("Max");
        testUser.setLastName("Mustermann");
        testUser.setEmail("max@mustermann.com");
        testUser.setChatId("493192316");
        testUser = userService.createUser(testUser);

        articleDto = new ArticleDto();
        articleDto.setBezeichnung("Camera");
        articleDto.setBeschreibung("High-quality DSLR Camera");
        articleDto.setGrundpreis(50);
        articleDto.setStueckzahl(2);

        ArticleInstanceDto instanceDto1 = new ArticleInstanceDto();
        instanceDto1.setInventoryNumber("INV-001");
        instanceDto1.setStatus("AVAILABLE");

        ArticleInstanceDto instanceDto2 = new ArticleInstanceDto();
        instanceDto2.setInventoryNumber("INV-002");
        instanceDto2.setStatus("AVAILABLE");

        articleDto.setArticleInstances(List.of(instanceDto1, instanceDto2));

        articleDto = articleServiceImpl.createArticle(articleDto);
    }




    @Test
    public void testRental() {
        LocalDate rentalStart = LocalDate.of(2025, 3, 10);
        LocalDate rentalEnd = LocalDate.of(2025, 3, 15);
        int quantity = 2; // Anzahl der gewünschten Instanzen

        Rental rental = new Rental();
        rental.setUser(testUser);
        rental.setRentalStatus(RentalStatus.PENDING);

        Article articleEntity = new Article();
        articleEntity.setId(articleDto.getId());
        articleEntity.setBezeichnung(articleDto.getBezeichnung());
        articleEntity.setBeschreibung(articleDto.getBeschreibung());
        articleEntity.setGrundpreis(articleDto.getGrundpreis());

        rentalService.createRental(rental, articleEntity, rentalStart, rentalEnd, quantity);

        List<Rental> userRentals = rentalService.getRentalsByUserId(testUser.getId());

        assertFalse(userRentals.isEmpty(), "Rental should be created and retrieved.");
        assertEquals(1, userRentals.size(), "User should have exactly one rental.");
        assertEquals(testUser.getId(), userRentals.get(0).getUser().getId(), "Rental should be associated with the correct user.");
    }
}
