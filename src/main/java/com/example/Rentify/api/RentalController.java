package com.example.Rentify.api;

import com.example.Rentify.dto.*;
import com.example.Rentify.entity.*;
import com.example.Rentify.mapper.ArticleMapper;
import com.example.Rentify.mapper.RentalMapper;
import com.example.Rentify.repo.RentalPositionRepo;
import com.example.Rentify.repo.RentalRepo;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.rental.RentalService;
import com.example.Rentify.service.article.ArticleServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.example.Rentify.utils.ResponseHandler;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


    @PutMapping("/{id}")
    public ResponseEntity<RentalDto> updateRental(@PathVariable Long id, @RequestBody Rental rental) {
        return ResponseHandler.handle(() -> rentalService.updateRental(id, rental));
    }


    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getRentalById(@PathVariable Long id) {
        return ResponseHandler.handle(() -> rentalService.getRentalById(id));
    }

    @GetMapping
    public ResponseEntity<List<RentalDto>> getAllRentals() {
        return ResponseHandler.handle(rentalService::getAllRentals);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        return ResponseHandler.handleVoid(() -> rentalService.deleteRental(id));
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

    //TODO get auth user -> make sure role is Admin
    @GetMapping("/admin/current")
    public ResponseEntity<List<AdminRentalInfoDto>> getCurrentRentals() {
        return ResponseHandler.handle(rentalService::getCurrentRentals);
    }

    @GetMapping("/admin/due")
    public ResponseEntity<List<AdminRentalInfoDto>> getDueRentals() {
        return ResponseHandler.handle(rentalService::getDueRentals);
    }

    @GetMapping("/admin/over-due")
    public ResponseEntity<List<AdminRentalInfoDto>> getOverDueRentals() {
        return ResponseHandler.handle(rentalService::getOverDueRentals);
    }

    @GetMapping("/admin/upcoming-under-repair")
    public ResponseEntity<List<AdminRentalInfoDto>> getUpcomingUnderRepairRentals() {
        return ResponseHandler.handle(rentalService::getUpcomingUnderRepairRentals);
    }

    @GetMapping("/admin/under-repair")
    public ResponseEntity<List<AdminRentalInfoDto>> getUnderRepairInstances() {
        return ResponseHandler.handle(rentalService::getUnderRepairInstancesSorted);
    }

    @GetMapping("/admin/rental/all-positions")
    public ResponseEntity<List<AdminRentalInfoDto>> getAllRentalPositions() {
        return ResponseHandler.handle(rentalService::getAllRentalPos);
    }


    @PatchMapping("/admin/update-rental/{rentalPositionId}")
    public ResponseEntity<AdminRentalInfoDto> updateRentalPeriod(
            @PathVariable Long rentalPositionId,
            @RequestBody RentalPositionDto updateDto) {

        return ResponseHandler.handle(() ->
                rentalService.updateRentalPeriod(rentalPositionId, updateDto)
        );

    }

    @PatchMapping("/admin/update-instance-status/{rentalPositionId}")
    public ResponseEntity<AdminRentalInfoDto> updateInstanceStatus(
            @PathVariable Long rentalPositionId,
            @RequestBody Map<String, String> request) {
        String newStatusStr = request.get("newStatus");
        return ResponseHandler.handle(() ->
                rentalService.updateInstanceStatus(rentalPositionId, newStatusStr)
        );
    }

    @PatchMapping("/admin/update-instance-status-by-inventory/{inventoryNumber}")
    public ResponseEntity<Void> updateInstanceStatusByInventoryNumber(
            @PathVariable String inventoryNumber,
            @RequestBody Map<String, String> request) {

        String newStatusStr = request.get("newStatus");
        return ResponseHandler.handle(() -> {
            rentalService.updateInstanceStatusByInventoryNo(inventoryNumber, newStatusStr);
            return null;
        });
    }

    @GetMapping("/my-positions")
    public ResponseEntity<List<CustomerRentalDto>> getMyRentalPositions() {
        User currentUser = getCurrentUser();
        return ResponseHandler.handle(() ->
                rentalService.getRentalPositionsForUser(currentUser.getId())
        );
    }

    @PatchMapping("/customer/update-rental/{rentalPositionId}")
    public ResponseEntity<CustomerRentalDto> updateRentalPeriodForCustomer(
            @PathVariable Long rentalPositionId,
            @RequestBody RentalPositionDto updateDto) {

        User currentUser = getCurrentUser();
        return ResponseHandler.handle(() ->
                rentalService.updateRentalPeriodForCustomer(rentalPositionId, updateDto, currentUser.getId())
        );
    }

    @DeleteMapping("/customer/delete-rental-position/{rentalPositionId}")
    public ResponseEntity<Void> deleteRentalPositionForCustomer(@PathVariable Long rentalPositionId) {
        User currentUser = getCurrentUser();
        return ResponseHandler.handleVoid(() ->
                rentalService.deleteRentalPositionForCustomer(rentalPositionId, currentUser.getId())
        );
    }








}
