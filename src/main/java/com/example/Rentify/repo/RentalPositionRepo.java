package com.example.Rentify.repo;

import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.RentalPosition;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface RentalPositionRepo extends CrudRepository<RentalPosition, Long> {

    @Query("SELECT COUNT(rp) > 0 FROM RentalPosition rp " +
            "WHERE rp.articleInstance = :instance " +
            "AND rp.rentalStart < :endDate " +
            "AND rp.rentalEnd > :startDate")
    boolean existsByArticleInstanceAndRentalPeriodOverlap(@Param("instance") ArticleInstance instance,
                                                          @Param("startDate") LocalDate startDate,
                                                          @Param("endDate") LocalDate endDate);
}
