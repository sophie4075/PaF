package com.example.Rentify.repo;

import com.example.Rentify.entity.Rental;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalRepo extends CrudRepository<Rental, Long> {
}
