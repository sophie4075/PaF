package com.example.Rentify.service.article;

import com.example.Rentify.dto.ArticleDto;

import java.util.List;
import java.util.Optional;

public interface ArticleService {
    ArticleDto createArticle(ArticleDto articleDto);
    List<ArticleDto> getAllArticles();
    Optional<ArticleDto> getArticleById(Long id);
    ArticleDto updateArticle(Long id, ArticleDto articleDto);
    void deleteArticle(Long id);
    String generateDescription(Long id);
}
