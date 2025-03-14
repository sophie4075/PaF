package com.example.Rentify.repo;

import com.example.Rentify.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepo extends JpaRepository<Reservation, Long> {
    List<Reservation> findByExpiryTimeBefore(LocalDateTime time);
}
