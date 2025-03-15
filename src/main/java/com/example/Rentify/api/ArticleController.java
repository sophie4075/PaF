package com.example.Rentify.api;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.AvailabilityDto;
import com.example.Rentify.repo.CategoryRepo;
import com.example.Rentify.service.article.ArticleService;
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

    //TODO add try catch
    public ArticleController(ArticleService articleService, CategoryRepo categoryRepo) {
        this.articleService = articleService;
        this.categoryRepo = categoryRepo;
    }

    //TODO add try catch
    @GetMapping
    public List<ArticleDto> getAllArticles() {
        return articleService.getAllArticles();
    }

    //TODO add try catch
    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //TODO add try catch
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

    //TODO add try catch
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


    //TODO add try catch
    @GetMapping("/filter")
    public ResponseEntity<List<ArticleDto>> getFilteredArticles(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<Long> categoryIds) {

        List<ArticleDto> articles = articleService.getFilteredArticles(minPrice, maxPrice, startDate, endDate, categoryIds);
        return ResponseEntity.ok(articles);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PatchMapping("/{id}")
    public ResponseEntity<ArticleDto> patchArticle(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            ArticleDto updated = articleService.patchArticle(id, updates);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam Long articleId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try{
            AvailabilityDto response = articleService.checkAvailability(articleId, startDate, endDate);
            return ResponseEntity.ok(response.toMap());
        }catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }

    }


}

