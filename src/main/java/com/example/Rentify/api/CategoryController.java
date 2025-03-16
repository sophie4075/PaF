package com.example.Rentify.api;

import com.example.Rentify.dto.CategoryDto;
import com.example.Rentify.service.category.CategoryService;
import com.example.Rentify.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseHandler.handle(categoryService::getAllCategories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDTO) {
        return ResponseHandler.handleWithStatus(() -> categoryService.createCategory(categoryDTO), HttpStatus.CREATED);
    }
}
