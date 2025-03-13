package com.example.Rentify.repo;

import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.RentalPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalPositionRepo extends JpaRepository<RentalPosition, Long> {
    List<RentalPosition> findByRentalId(Long rentalId);

    @Query("SELECT COUNT(rp) > 0 FROM RentalPosition rp " +
            "WHERE rp.articleInstance = :instance " +
            "AND rp.rentalStart < :endDate " +
            "AND rp.rentalEnd > :startDate")
    boolean existsByArticleInstanceAndRentalPeriodOverlap(@Param("instance") ArticleInstance instance,
                                                          @Param("startDate") LocalDate startDate,
                                                          @Param("endDate") LocalDate endDate);

}

