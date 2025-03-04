package com.example.Rentify.service.article;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Category;
import com.example.Rentify.mapper.ArticleMapper;
import com.example.Rentify.repo.ArticleRepo;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.CategoryRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepo articleRepo;
    private final ObjectMapper objectMapper;
    private final CategoryRepo categoryRepo;
    private final ArticleInstanceRepo articleInstanceRepo;

    @Value("${gemini.api.key}")
    private String apiKey;

    public ArticleServiceImpl(ArticleRepo articleRepo,
                              ArticleInstanceRepo articleInstanceRepo,
                              CategoryRepo categoryRepo) {
        this.articleRepo = articleRepo;
        this.articleInstanceRepo = articleInstanceRepo;
        this.categoryRepo = categoryRepo;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public ArticleDto createArticle(ArticleDto articleDto) {
        Article article = new Article();
        article.setBezeichnung(articleDto.getBezeichnung());
        article.setBeschreibung(articleDto.getBeschreibung());
        article.setStueckzahl(articleDto.getStueckzahl());
        article.setGrundpreis(articleDto.getGrundpreis());
        article.setBildUrl(articleDto.getBildUrl());

        if (articleDto.getCategories() != null && !articleDto.getCategories().isEmpty()) {
            Set<Category> categories = new HashSet<>();
            articleDto.getCategories().forEach(catDto -> {
                Category category;
                // Try to load ID
                if (catDto.getId() != null) {
                    category = categoryRepo.findById(catDto.getId())
                            .orElseGet(() -> {
                                Category newCategory = new Category();
                                newCategory.setName(catDto.getName());
                                return categoryRepo.save(newCategory);
                            });
                } else {
                    // No ID - create new Category
                    category = new Category();
                    category.setName(catDto.getName());
                    category = categoryRepo.save(category);
                }
                categories.add(category);
            });
            article.setCategories(categories);
        }

        Article saved = articleRepo.save(article);
        return ArticleMapper.toDTO(saved);
    }

    @Override
    public List<ArticleDto> getAllArticles() {
        return articleRepo.findAll().stream()
                .map(ArticleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ArticleDto> getArticleById(Long id) {
        return articleRepo.findById(id)
                .map(ArticleMapper::toDTO);
    }

    @Override
    public ArticleDto updateArticle(Long id, ArticleDto articleDto) {
        Article updated = articleRepo.findById(id)
                .map(article -> {
                    article.setBezeichnung(articleDto.getBezeichnung());
                    article.setBeschreibung(articleDto.getBeschreibung());
                    article.setStueckzahl(articleDto.getStueckzahl());
                    article.setGrundpreis(articleDto.getGrundpreis());
                    article.setBildUrl(articleDto.getBildUrl());

                    if (articleDto.getCategories() != null && !articleDto.getCategories().isEmpty()) {
                        Set<Category> categories = new HashSet<>();
                        articleDto.getCategories().forEach(catDto -> {
                            Category category;
                            // Try to load ID
                            if (catDto.getId() != null) {
                                category = categoryRepo.findById(catDto.getId())
                                        .orElseGet(() -> {
                                            Category newCategory = new Category();
                                            newCategory.setName(catDto.getName());
                                            return categoryRepo.save(newCategory);
                                        });
                            } else {
                                // No ID - create new Category
                                category = new Category();
                                category.setName(catDto.getName());
                                category = categoryRepo.save(category);
                            }
                            categories.add(category);
                        });
                        article.setCategories(categories);
                    }


                    return articleRepo.save(article);
                })
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
        return ArticleMapper.toDTO(updated);
    }

    @Override
    public void deleteArticle(Long id) {
        if (articleRepo.existsById(id)) {
            articleRepo.deleteById(id);
        } else {
            throw new IllegalArgumentException("Article not found with id: " + id);
        }
    }

    @Override
    public String generateDescription(Long id) {
        Optional<Article> articleOpt = articleRepo.findById(id);
        if (articleOpt.isPresent()) {
            Article article = articleOpt.get();
            String prompt = String.format("Erstelle eine Beschreibung für einen Artikel mit folgendem Namen: %s.", article.getBezeichnung());
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            String requestBody = String.format("{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}", prompt);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                try {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    String text = root.path("candidates")
                            .get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text").asText();
                    article.setBeschreibung(text);
                    articleRepo.save(article);
                    return text;
                } catch (Exception e) {
                    throw new RuntimeException("Fehler beim Verarbeiten der API-Antwort: " + e.getMessage(), e);
                }
            } else {
                throw new RuntimeException("Fehler beim Abrufen der Beschreibung von der Gemini-API");
            }
        } else {
            throw new IllegalArgumentException("Article not found with id: " + id);
        }
    }

    @Override
    public String generateDescriptionForName(String bezeichnung) {
        String prompt = String.format(
                "Erstelle eine Beschreibung für eine Verleihplattform für einen Artikel mit folgendem Namen: %s.",
                bezeichnung
        );

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if(response.getStatusCode().is2xxSuccessful()){
            try{
                JsonNode root = objectMapper.readTree(response.getBody());
                return root
                        .path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();
            } catch(Exception e) {
                throw new RuntimeException("Fehler beim Verarbeiten der API-Antwort: " + e.getMessage(), e);
            }
        } else {
            throw new RuntimeException("Fehler beim Abrufen der Beschreibung von der API");
        }
    }
}

