package com.example.Rentify.repo;

import com.example.Rentify.dto.AdminRentalInfoDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ArticleInstanceRepo extends JpaRepository<ArticleInstance, Long> {

    List<ArticleInstance> findByArticle(Article article);


    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "0L, null, null, CAST(0 AS bigdecimal), '', 0L, '', '', ai.article.bezeichnung, ai.inventoryNumber, ai.status) " +
            "FROM ArticleInstance ai WHERE ai.status = com.example.Rentify.entity.Status.UNDER_REPAIR")
    List<AdminRentalInfoDto> testAllUnderRepairNoJoin();

    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "0L, null, null, CAST(0 AS bigdecimal), '', 0L, '', '', ai.article.bezeichnung, ai.inventoryNumber, ai.status) " +
            "FROM ArticleInstance ai WHERE ai.status = com.example.Rentify.entity.Status.OVERDUE")
    List<AdminRentalInfoDto> getOverDue();

    @Query("SELECT new com.example.Rentify.dto.AdminRentalInfoDto(" +
            "0L, null, null, CAST(0 AS bigdecimal), '', 0L, '', '', " +
            "ai.article.bezeichnung, ai.inventoryNumber, ai.status) " +
            "FROM ArticleInstance ai " +
            "LEFT JOIN RentalPosition rp ON ai = rp.articleInstance AND rp.rentalStart > :today " +
            "WHERE ai.status = com.example.Rentify.entity.Status.UNDER_REPAIR " +
            "GROUP BY ai.id, ai.article.bezeichnung, ai.inventoryNumber, ai.status, rp.rentalStart " +
            "ORDER BY CASE WHEN MAX(rp.rentalStart) IS NOT NULL THEN 0 ELSE 1 END, MAX(rp.rentalStart) ASC")
    List<AdminRentalInfoDto> findUnderRepairSortedByUpcomingRental(@Param("today") LocalDate today);











}
