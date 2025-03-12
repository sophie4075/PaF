package com.example.Rentify.repo;

import com.example.Rentify.entity.RentalPosition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalPositionRepo extends JpaRepository<RentalPosition, Long> {
}