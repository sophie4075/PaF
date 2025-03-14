package com.example.Rentify.api;

import com.example.Rentify.dto.ReservationDto;
import com.example.Rentify.dto.ReservationReqDto;
import com.example.Rentify.entity.User;
import com.example.Rentify.service.ReservationService;
import com.example.Rentify.repo.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepo userRepo;  // Um den aktuellen User zu laden

    public ReservationController(ReservationService reservationService, UserRepo userRepo) {
        this.reservationService = reservationService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<ReservationDto> createReservation(@RequestBody ReservationReqDto reqDto) {
        try {
            User currentUser = getCurrentUser();
            ReservationDto dto = reservationService.createReservation(currentUser, reqDto.getArticleInstanceId());
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto> getReservation(@PathVariable Long id) {
        try {
            ReservationDto dto = reservationService.getReservationById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

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

