/*package com.example.Rentify.api;

import com.example.Rentify.entity.Article;
import com.example.Rentify.service.article.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        Article createdArticle = articleService.createArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article updatedArticle) {
        try {
            return ResponseEntity.ok(articleService.updateArticle(id, updatedArticle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/generate-description")
    public ResponseEntity<String> generateDescription(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> {
                    String description = articleService.generateDescription(article);
                    article.setBeschreibung(description);
                    articleService.updateArticle(id, article);
                    return ResponseEntity.ok(description);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}*/
package com.example.Rentify.api;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.entity.Category;
import com.example.Rentify.repo.CategoryRepo;
import com.example.Rentify.service.article.ArticleService;
import org.jetbrains.annotations.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final CategoryRepo categoryRepo;

    public ArticleController(ArticleService articleService, CategoryRepo categoryRepo) {
        this.articleService = articleService;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public List<ArticleDto> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ArticleDto> createArticle(@RequestBody ArticleDto articleDto) {
        ArticleDto createdArticle = articleService.createArticle(articleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDto> updateArticle(@PathVariable Long id, @RequestBody ArticleDto articleDto) {
        try {
            ArticleDto updated = articleService.updateArticle(id, articleDto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/generate-description")
    public ResponseEntity<String> generateDescription(@PathVariable Long id) {
        try {
            String description = articleService.generateDescription(id);
            return ResponseEntity.ok(description);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/generate-description-by-name")
    public ResponseEntity<String> generateDescriptionByName(@RequestBody Map<String, String> body) {
        String bezeichnung = body.get("bezeichnung");
        if (bezeichnung == null || bezeichnung.isEmpty()) {
            return ResponseEntity.badRequest().body("Bezeichnung fehlt.");
        }
        // Erstelle den Prompt und rufe die Gemini-API auf
        String description = articleService.generateDescriptionForName(bezeichnung);
        return ResponseEntity.ok(description);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ArticleDto>> getFilteredArticles(
            @RequestParam(required = false) double minPrice,
            @RequestParam(required = false) double maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<Long> categoryIds) {

        // Hole die ausgewählten Kategorien
        List<Category> selectedCategories = categoryRepo.findAllById(categoryIds);
        if (selectedCategories.isEmpty()) {
            throw new RuntimeException("No category found.");
        }

        // Erstelle ein Set mit allen Kategorien (direkt ausgewählt + untergeordnete)
        Set<Category> allCategories = new HashSet<>(selectedCategories);
        // Erstelle ein Set für die IDs der Parent-Kategorien
        Set<Integer> parentCategoryIds = new HashSet<>();

        for (Category category : selectedCategories) {
            // Angenommen, bei einer Parent-Kategorie ist parentId null
            if (category.getParent() == null) {
                // Füge die ID der Parent-Kategorie hinzu
                parentCategoryIds.add(category.getId().intValue());
                // Falls vorhanden, füge alle Child-Kategorien hinzu
                if (category.getSubCategories() != null) {
                    allCategories.addAll(category.getSubCategories());
                }
            }
        }

        // Übergib beide Listen an den Service
        List<ArticleDto> articles = articleService.getFilteredArticles(
                minPrice,
                maxPrice,
                startDate,
                endDate,
                new ArrayList<>(allCategories),
                new ArrayList<>(parentCategoryIds)
        );
        return ResponseEntity.ok(articles);
    }


    /*public ResponseEntity<List<ArticleDto>> getFilteredArticles(
            @RequestParam(required = false)  double minPrice,
            @RequestParam(required = false)  double maxPrice,
            @RequestParam(required = false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false)  List<Long> categoryIds) {

        List<Category> categories = categoryRepo.findAllById(categoryIds);
        if (categories.isEmpty()) {
            throw new RuntimeException("No category found.");
        }
        List<ArticleDto> articles = articleService.getFilteredArticles(minPrice, maxPrice, startDate, endDate, categories);
        return ResponseEntity.ok(articles);
    }*/


}

