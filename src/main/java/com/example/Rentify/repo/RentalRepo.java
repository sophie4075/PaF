package com.example.Rentify.repo;

import com.example.Rentify.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRepo extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);
}
