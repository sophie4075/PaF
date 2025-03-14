package com.example.Rentify.mapper;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.dto.CategoryDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;

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

    public static ArticleInstanceDto toInstanceDto(ArticleInstance instance) {
        if (instance == null) {
            return null;
        }
        ArticleInstanceDto dto = new ArticleInstanceDto();
        dto.setId(instance.getId());
        dto.setInventoryNumber(instance.getInventoryNumber());
        dto.setStatus(instance.getStatus().toString());
        return dto;
    }

    public static Article toEntity(ArticleDto dto) {
        if (dto == null) {
            return null;
        }
        Article article = new Article();
        article.setId(dto.getId());
        article.setBezeichnung(dto.getBezeichnung());
        article.setBeschreibung(dto.getBeschreibung());
        article.setStueckzahl(dto.getStueckzahl());
        article.setGrundpreis(dto.getGrundpreis());
        article.setBildUrl(dto.getBildUrl());
        // Optional: Kategorien mappen, falls nötig
        return article;
    }


}
