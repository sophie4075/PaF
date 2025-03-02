package com.example.Rentify.service.category;

import com.example.Rentify.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto createCategory(CategoryDto categoryDTO);
}
