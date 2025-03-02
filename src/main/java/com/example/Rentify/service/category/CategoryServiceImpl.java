package com.example.Rentify.service.category;

import com.example.Rentify.dto.CategoryDto;
import com.example.Rentify.entity.Category;
import com.example.Rentify.mapper.CategoryMapper;
import com.example.Rentify.repo.CategoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;

    public CategoryServiceImpl(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepo.findAll();
        return categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        // TODO ? If parent shall be passed
        // category.setParent(...);
        Category savedCategory = categoryRepo.save(category);
        return CategoryMapper.toDTO(savedCategory);
    }
}
