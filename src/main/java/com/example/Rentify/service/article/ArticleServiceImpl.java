package com.example.Rentify.service.article;

import com.example.Rentify.dto.ArticleDto;
import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.dto.AvailabilityDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.Category;
import com.example.Rentify.entity.Status;
import com.example.Rentify.mapper.ArticleMapper;
import com.example.Rentify.repo.ArticleRepo;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.CategoryRepo;
import com.example.Rentify.repo.RentalPositionRepo;
import com.example.Rentify.service.Storage.StorageServiceImpl;
import com.example.Rentify.utils.ArticleSpecification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepo articleRepo;
    private final ObjectMapper objectMapper;
    private final CategoryRepo categoryRepo;
    private final ArticleInstanceRepo articleInstanceRepo;
    private final StorageServiceImpl storageServiceImpl;
    private final RentalPositionRepo rentalPositionRepo;

    @Value("${gemini.api.key}")
    private String apiKey;

    public ArticleServiceImpl(ArticleRepo articleRepo,
                              ArticleInstanceRepo articleInstanceRepo,
                              CategoryRepo categoryRepo,
                              StorageServiceImpl storageServiceImpl,
                              RentalPositionRepo rentalPositionRepo) {
        this.articleRepo = articleRepo;
        this.articleInstanceRepo = articleInstanceRepo;
        this.categoryRepo = categoryRepo;
        this.objectMapper = new ObjectMapper();
        this.storageServiceImpl = storageServiceImpl;
        this.rentalPositionRepo = rentalPositionRepo;
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

        List<ArticleInstanceDto> instanceDtos = articleDto.getArticleInstances();

        if (instanceDtos.size() == 1) {
            String statusValue = instanceDtos.getFirst().getStatus();
            for (int i = 1; i <= saved.getStueckzahl(); i++) {
                ArticleInstance instance = new ArticleInstance();
                instance.setArticle(saved);
                instance.setStatus(Status.valueOf(statusValue.toUpperCase()));
                instance.setInventoryNumber("ART-" + saved.getId() + "-" + i);
                articleInstanceRepo.save(instance);
            }
        } else if (instanceDtos.size() == saved.getStueckzahl()) {
            int counter = 1;
            for (ArticleInstanceDto dto : instanceDtos) {
                ArticleInstance instance = new ArticleInstance();
                instance.setArticle(saved);
                instance.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));
                instance.setInventoryNumber("ART-" + saved.getId() + "-" + counter);
                articleInstanceRepo.save(instance);
                counter++;
            }
        } else {
            throw new IllegalArgumentException("The number of instances does not match the number of units.");
        }

        return ArticleMapper.toDTO(saved);
    }

    public ArticleInstance createArticleInstance(ArticleInstance articleInstance) {
        return articleInstanceRepo.save(articleInstance);
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

    public String Prompt = "Erstelle eine Beschreibung für eine Verleihplattform für einen Artikel mit folgendem Namen: %s. Bitte benutze keine Platzhalter, sondern erstelle einen fertigen Text. Der text darf gerne ganz leicht humoristisch sein.";

    @Override
    public String generateDescription(Long id) {
        Optional<Article> articleOpt = articleRepo.findById(id);
        if (articleOpt.isPresent()) {
            Article article = articleOpt.get();
            String prompt = String.format(Prompt, article.getBezeichnung());
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
                Prompt,
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


    @Override
    public List<ArticleDto> getFilteredArticles(Double minPrice, Double maxPrice, LocalDate startDate,
                                                LocalDate endDate, List<Long> categoryIds) {

        Specification<Article> spec = Specification.where(null);

        if(minPrice != null && maxPrice != null) {
            spec = spec.and(ArticleSpecification.hasPriceBetween(minPrice, maxPrice));
        }
        if(startDate != null && endDate != null) {
            spec = spec.and(ArticleSpecification.isAvailableBetween(startDate, endDate));
        }
        if(categoryIds != null && !categoryIds.isEmpty()){
            spec = spec.and(ArticleSpecification.hasCategory(categoryIds));
        }
        List<Article> articles = articleRepo.findAll(spec);
        return articles.stream()
                .map(ArticleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ArticleDto patchArticle(Long id, Map<String, Object> updates) {
        Article updated = articleRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        if (updates.containsKey("beschreibung")) {
            String newBeschreibung = (String) updates.get("beschreibung");
            if (newBeschreibung != null && !newBeschreibung.trim().isEmpty() &&
                    !newBeschreibung.equals(updated.getBeschreibung())) {
                updated.setBeschreibung(newBeschreibung);
            }
        }

        if (updates.containsKey("grundpreis")) {
            Double newGrundpreis = Double.valueOf(updates.get("grundpreis").toString());
            if (!newGrundpreis.equals(updated.getGrundpreis())) {
                updated.setGrundpreis(newGrundpreis);
            }
        }

        if (updates.containsKey("bildUrl")) {
            String newBildUrl = (String) updates.get("bildUrl");
            if (newBildUrl != null && !newBildUrl.trim().isEmpty() &&
                    !newBildUrl.equals(updated.getBildUrl())) {
                if (updated.getBildUrl() != null && !updated.getBildUrl().trim().isEmpty()) {
                    try {
                        storageServiceImpl.deleteImage(updated.getBildUrl());
                    } catch (Exception e) {
                        System.err.println("Error deleting existing image: " + e.getMessage());
                    }
                }
                updated.setBildUrl(newBildUrl);
            }
        }

        if (updates.containsKey("categories")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> catDtos = (List<Map<String, Object>>) updates.get("categories");
            if (catDtos != null && !catDtos.isEmpty()) {
                Set<Category> newCategories = new HashSet<>();
                catDtos.forEach(catDto -> {
                    Category category;
                    Object idObj = catDto.get("id");
                    String name = (String) catDto.get("name");
                    if (idObj != null) {
                        Long catId = Long.valueOf(idObj.toString());
                        category = categoryRepo.findById(catId)
                                .orElseGet(() -> {
                                    Category newCategory = new Category();
                                    newCategory.setName(name);
                                    return categoryRepo.save(newCategory);
                                });
                    } else {
                        category = new Category();
                        category.setName(name);
                        category = categoryRepo.save(category);
                    }
                    newCategories.add(category);
                });
                // Beispielhafter Vergleich: Falls sich die neuen Kategorien unterscheiden, aktualisieren.
                if (!newCategories.equals(updated.getCategories())) {
                    updated.setCategories(newCategories);
                }
            }
        }

        Article saved = articleRepo.save(updated);
        return ArticleMapper.toDTO(saved);
    }


    @Override
    public AvailabilityDto checkAvailability(Long articleId, LocalDate startDate, LocalDate endDate) {
        Article article = articleRepo.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + articleId));

        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days <= 0) {
            throw new IllegalArgumentException("End Date muss be after Start Date.");
        }

        List<Long> availableInstanceNumbers = new ArrayList<>();
        for (ArticleInstance instance : article.getArticleInstances()) {
            if (instance.getStatus() == Status.AVAILABLE) {
                boolean booked = rentalPositionRepo.existsByArticleInstanceAndRentalPeriodOverlap(instance, startDate, endDate);
                if (!booked) {
                    availableInstanceNumbers.add(instance.getId());
                }
            }
        }
        boolean isAvailable = !availableInstanceNumbers.isEmpty();

        // Berechne den Preis für eine Instanz (pro Tag) – Frontend kann dann multiplizieren
        BigDecimal totalPrice = isAvailable
                ? BigDecimal.valueOf(article.getGrundpreis()).multiply(BigDecimal.valueOf(days))
                : BigDecimal.ZERO;

        AvailabilityDto dto = new AvailabilityDto(isAvailable, totalPrice);
        dto.setAvailableInstanceNumbers(availableInstanceNumbers);
        return dto;
    }



}

