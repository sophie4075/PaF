package com.example.Rentify.api;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.dto.RentalReqDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.RentalPosition;
import com.example.Rentify.entity.User;
import com.example.Rentify.mapper.ArticleMapper;
import com.example.Rentify.mapper.RentalMapper;
import com.example.Rentify.repo.RentalPositionRepo;
import com.example.Rentify.repo.RentalRepo;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.RentalService;
import com.example.Rentify.service.article.ArticleServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/rental")
public class RentalController {
    private final RentalService rentalService;
    private final UserRepo userRepo;
    private final ArticleServiceImpl articleService;
    private final RentalRepo rentalRepo;
    private final RentalPositionRepo rentalPositionRepo;

    public RentalController(RentalService rentalService,
                            UserRepo userRepo,
                            ArticleServiceImpl articleService,
                            RentalRepo rentalRepo,
                            RentalPositionRepo rentalPositionRepo
                            ) {
        this.rentalService = rentalService;
        this.userRepo = userRepo;
        this.articleService = articleService;
        this.rentalRepo = rentalRepo;
        this.rentalPositionRepo = rentalPositionRepo;

    }

    @PostMapping
    public ResponseEntity<RentalDto> createRental(@RequestBody RentalReqDto rentalReqDto) {
        try {
            //Get auth User
            User currentUser = getCurrentUser();
            Rental rental = rentalReqDto.getRental();
            rental.setUser(currentUser);

            //  Save rental to get id
            Rental savedRental = rentalRepo.save(rental);

            // Für each article withing Payload:
            for (RentalReqDto.ArticleRentalReqDto req : rentalReqDto.getArticleRentals()) {
                // Load article as DTO and turn into Article
                ArticleDto articleDto = articleService.getArticleById(req.getArticleId())
                        .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + req.getArticleId()));
                Article article = ArticleMapper.toEntity(articleDto);

                rentalService.createRental(savedRental, article, req.getRentalStart(), req.getRentalEnd(), req.getQuantity());
            }

            // Calculate total price and update rental
            BigDecimal totalPrice = rentalService.calculateTotalPrice(savedRental.getId());
            savedRental.setTotalPrice(totalPrice);
            rentalRepo.save(savedRental);

            List<RentalPosition> savedPositions = rentalPositionRepo.findByRentalId(savedRental.getId());
            RentalDto rentalDto = RentalMapper.toDTO(savedRental, savedPositions);
            return ResponseEntity.status(HttpStatus.CREATED).body(rentalDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @PutMapping("/{id}")
    public ResponseEntity<RentalDto> updateRental(@PathVariable Long id, @RequestBody Rental rental) {
        try {
            return ResponseEntity.ok(rentalService.updateRental(id, rental));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getRentalById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rentalService.getRentalById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<RentalDto>> getAllRentals() {
        try {
            return ResponseEntity.ok(rentalService.getAllRentals());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        try {
            rentalService.deleteRental(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    //Helper to get current User
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            //Replace with Pattern var?
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userRepo.findFirstByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }
        throw new UsernameNotFoundException("User not found");
    }
}
