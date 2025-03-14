package com.example.Rentify.service;

import com.example.Rentify.dto.ReservationDto;
import com.example.Rentify.entity.*;
import com.example.Rentify.mapper.ReservationMapper;
import com.example.Rentify.repo.ReservationRepo;
import com.example.Rentify.repo.ArticleInstanceRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class ReservationService {

    private final ReservationRepo reservationRepo;
    private final ArticleInstanceRepo articleInstanceRepo;

    public ReservationService(ReservationRepo reservationRepo, ArticleInstanceRepo articleInstanceRepo) {
        this.reservationRepo = reservationRepo;
        this.articleInstanceRepo = articleInstanceRepo;
    }

    @Transactional
    public ReservationDto createReservation(User user, Long articleInstanceId) {
        // Hole die Artikelinstanz
        ArticleInstance instance = articleInstanceRepo.findById(articleInstanceId)
                .orElseThrow(() -> new IllegalArgumentException("ArticleInstance not found with id: " + articleInstanceId));

        if (instance.getStatus() != null && !instance.getStatus().equals(Status.AVAILABLE)) {
            throw new IllegalArgumentException("ArticleInstance is not available");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setArticleInstance(instance);
        reservation.setReservationTime(LocalDateTime.now());
        reservation.setExpiryTime(LocalDateTime.now().plusMinutes(45));
        reservation.setStatus(ReservationStatus.RESERVED);

        Reservation saved = reservationRepo.save(reservation);
        return ReservationMapper.toDTO(saved);
    }

    public ReservationDto getReservationById(Long id) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with id: " + id));
        return ReservationMapper.toDTO(reservation);
    }

    // Optional: updateReservation, deleteReservation etc.
}

