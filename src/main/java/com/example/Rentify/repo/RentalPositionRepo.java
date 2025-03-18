package com.example.Rentify.repo;

import com.example.Rentify.dto.AdminRentalInfoDto;
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
    List<RentalPosition> findByRentalStartLessThanEqualAndRentalEndGreaterThanEqual(LocalDate date1, LocalDate date2);


    @Query("SELECT COUNT(rp) > 0 FROM RentalPosition rp " +
            "WHERE rp.articleInstance = :instance " +
            "AND rp.rentalStart < :endDate " +
            "AND rp.rentalEnd > :startDate")
    boolean existsByArticleInstanceAndRentalPeriodOverlap(@Param("instance") ArticleInstance instance,
                                                          @Param("startDate") LocalDate startDate,
                                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "rp.id, rp.rentalStart, rp.rentalEnd, rp.positionPrice, " +
            "rp.rental.user.email, rp.rental.user.id, rp.rental.user.firstName, rp.rental.user.lastName, " +
            "rp.articleInstance.article.bezeichnung, rp.articleInstance.inventoryNumber, " +
            "rp.articleInstance.status" +
            ") " +
            "FROM RentalPosition rp " +
            "WHERE rp.rentalStart <= :now AND rp.rentalEnd >= :now")
    List<AdminRentalInfoDto> findCurrentRentalInfo(@Param("now") LocalDate now);


    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "rp.id, rp.rentalStart, rp.rentalEnd, rp.positionPrice, " +
            "rp.rental.user.email, rp.rental.user.id, rp.rental.user.firstName, rp.rental.user.lastName," +
            "rp.articleInstance.article.bezeichnung, rp.articleInstance.inventoryNumber," +
            "rp.articleInstance.status" +
            ") " +
            "FROM RentalPosition rp " +
            "WHERE rp.rentalEnd = :today")
    List<AdminRentalInfoDto> findDueRentalInfo(@Param("today") LocalDate today);

    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "rp.id, rp.rentalStart, rp.rentalEnd, rp.positionPrice, " +
            "rp.rental.user.email, rp.rental.user.id, rp.rental.user.firstName, rp.rental.user.lastName, " +
            "rp.articleInstance.article.bezeichnung, rp.articleInstance.inventoryNumber," +
            "rp.articleInstance.status" +
            ") " +
            "FROM RentalPosition rp " +
            "WHERE rp.rentalStart > :now AND rp.rentalStart <= :sevenDaysLater " +
            "AND rp.articleInstance.status = 'UNDER_REPAIR'")
    List<AdminRentalInfoDto> findUpcomingUnderRepairRentalInfo(@Param("now") LocalDate now, @Param("sevenDaysLater") LocalDate sevenDaysLater);

    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "rp.id, rp.rentalStart, rp.rentalEnd, rp.positionPrice, " +
            "rp.rental.user.email, rp.rental.user.id, rp.rental.user.firstName, rp.rental.user.lastName, " +
            "rp.articleInstance.article.bezeichnung, rp.articleInstance.inventoryNumber, rp.articleInstance.status) " +
            "FROM RentalPosition rp")
    List<AdminRentalInfoDto> findAllRentalPosAsDto();


    @Query("SELECT COUNT(rp) > 0 FROM RentalPosition rp " +
            "WHERE rp.articleInstance = :instance " +
            "AND rp.id <> :currentRentalPositionId " +
            "AND rp.rentalStart < :newRentalEnd " +
            "AND rp.rentalEnd > :currentRentalEnd")
    boolean existsOverlapExcludingCurrent(@Param("instance") ArticleInstance instance,
                                          @Param("currentRentalPositionId") Long currentRentalPositionId,
                                          @Param("currentRentalEnd") LocalDate currentRentalEnd,
                                          @Param("newRentalEnd") LocalDate newRentalEnd);



}

