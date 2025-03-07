package com.example.Rentify.repo;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ArticleRepo extends JpaRepository<Article, Long> {

    @Query("SELECT a FROM Article a " +
            "WHERE a.grundpreis BETWEEN :minPrice AND :maxPrice " +
            "AND EXISTS (SELECT cat FROM a.categories cat " +
            "            WHERE cat IN :categories " +
            "               OR cat.parent.id IN :parentCategoryIds) " +
            "AND NOT EXISTS (" +
            "    SELECT rp FROM RentalPosition rp " +
            "    WHERE rp.articleInstance.article = a " +
            "      AND rp.rentalStart < :endDate " +
            "      AND rp.rentalEnd > :startDate" +
            ")")
    List<Article> findAvailableArticles(@Param("minPrice") double minPrice,
                                        @Param("maxPrice") double maxPrice,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate,
                                        @Param("categories") List<Category> categories,
                                        @Param("parentCategoryIds") List<Integer> parentCategoryIds);






}
