package com.example.Rentify.service.article;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.entity.Category;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ArticleService {
    ArticleDto createArticle(ArticleDto articleDto);
    List<ArticleDto> getAllArticles();
    Optional<ArticleDto> getArticleById(Long id);
    ArticleDto updateArticle(Long id, ArticleDto articleDto);
    void deleteArticle(Long id);
    String generateDescription(Long id);
    String generateDescriptionForName(String bezeichnung);
    List<ArticleDto> getFilteredArticles(Double minPrice, Double maxPrice, LocalDate startDate, LocalDate endDate, List<Long> categoryIds);
}
