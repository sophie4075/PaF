package com.example.Rentify.api;

import com.example.Rentify.utils.ResponseHandler;
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
        return ResponseHandler.handleOptional(() -> articleService.getArticleById(id));
    }

    @PostMapping
    public ResponseEntity<ArticleDto> createArticle(@RequestBody ArticleDto articleDto) {
        return ResponseHandler.handleWithStatus(() -> articleService.createArticle(articleDto), HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDto> updateArticle(@PathVariable Long id, @RequestBody ArticleDto articleDto) {
        return ResponseHandler.handle(() -> articleService.updateArticle(id, articleDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        return ResponseHandler.handleVoid(() -> articleService.deleteArticle(id));
    }

    @PostMapping("/{id}/generate-description")
    public ResponseEntity<String> generateDescription(@PathVariable Long id) {
        return ResponseHandler.handle(() -> articleService.generateDescription(id));
    }

    //TODO add try catch
    @PostMapping("/generate-description-by-name")
    public ResponseEntity<String> generateDescriptionByName(@RequestBody Map<String, String> body) {
        String bezeichnung = body.get("bezeichnung");
        if (bezeichnung == null || bezeichnung.isEmpty()) {
            return ResponseEntity.badRequest().body("Description is missing.");
        }
        return ResponseHandler.handle(() -> articleService.generateDescriptionForName(bezeichnung));
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
        return ResponseHandler.handle(() -> articleService.patchArticle(id, updates));
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
