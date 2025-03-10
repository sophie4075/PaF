package com.example.Rentify.mapper;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.CategoryDto;
import com.example.Rentify.entity.Article;

import java.util.List;
import java.util.stream.Collectors;

public class ArticleMapper {
    public static ArticleDto toDTO(Article article) {
        if (article == null) {
            return null;
        }
        ArticleDto dto = new ArticleDto();
        dto.setId(article.getId());
        dto.setBezeichnung(article.getBezeichnung());
        dto.setBeschreibung(article.getBeschreibung());
        dto.setStueckzahl(article.getStueckzahl());
        dto.setGrundpreis(article.getGrundpreis());
        dto.setBildUrl(article.getBildUrl());
        // Map categories if existent
        if (article.getCategories() != null) {
            List<CategoryDto> categoryDTOs = article.getCategories().stream()
                    .map(CategoryMapper::toDTO)
                    .collect(Collectors.toList());
            dto.setCategories(categoryDTOs);
        }
        return dto;
    }
}
