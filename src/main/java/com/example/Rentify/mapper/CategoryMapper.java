package com.example.Rentify.mapper;

import com.example.Rentify.dto.CategoryDto;
import com.example.Rentify.entity.Category;

public class CategoryMapper {

    public static CategoryDto toDTO(Category category) {
        if (category == null) {
            return null;
        }
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        return dto;
    }
}
