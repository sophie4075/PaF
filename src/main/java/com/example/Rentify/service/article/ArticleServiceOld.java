/*package com.example.Rentify.service.article;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.Status;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.ArticleRepo;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepo articleRepo;
    private final ArticleInstanceRepo articleInstanceRepo;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    public ArticleService(ArticleRepo articleRepo, ArticleInstanceRepo articleInstanceRepo) {
        this.articleRepo = articleRepo;
        this.articleInstanceRepo = articleInstanceRepo;
        this.objectMapper = new ObjectMapper();
    }

    public Article createArticle(Article article) {
        return articleRepo.save(article);
    }

    public List<Article> getAllArticles() {
        return articleRepo.findAll();
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepo.findById(id);
    }

    public Article updateArticle(Long id, Article updatedArticle) {
        return articleRepo.findById(id)
                .map(article -> {
                    article.setBezeichnung(updatedArticle.getBezeichnung());
                    article.setBeschreibung(updatedArticle.getBeschreibung());
                    int currentCount = article.getArticleInstances() != null
                            ? article.getArticleInstances().size() : 0;
                    int newCount = updatedArticle.getStueckzahl();
                    article.setStueckzahl(newCount);
                    article.setGrundpreis(updatedArticle.getGrundpreis());
                    article.setBildUrl(updatedArticle.getBildUrl());
                    //return articleRepo.save(article);
                    Article savedArticle = articleRepo.save(article);
                    adjustArticleInstances(savedArticle, currentCount, newCount);
                    return savedArticle;

                })
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
    }

    public void deleteArticle(Long id) {
        if (articleRepo.existsById(id)) {
            articleRepo.deleteById(id);
        } else {
            throw new IllegalArgumentException("Article not found with id: " + id);
        }
    }

    // Generiert eine Beschreibung für einen Artikel anhand der Bezeichnung
    public String generateDescription(Article article) {
        // Prompt für das LLM
        String prompt = String.format(
                "Erstelle eine Beschreibung für einen Artikel mit folgendem Namen: %s. Nur Text ohne * oder #. Auch keine Optionalen Links oder ähnliches.",
                article.getBezeichnung()
        );

        // API-URL und Header
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Request-Body erstellen
        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        // API-Aufruf
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                // JSON-Antwort verarbeiten
                JsonNode root = objectMapper.readTree(response.getBody());
                String text = root
                        .path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();
                return text;
            } catch (Exception e) {
                throw new RuntimeException("Fehler beim Verarbeiten der API-Antwort: " + e.getMessage(), e);
            }
        } else {
            throw new RuntimeException("Fehler beim Abrufen der Beschreibung von der Gemini-API");
        }
    }

    private void adjustArticleInstances(Article article, int currentCount, int newCount) {

        if(newCount > currentCount) {
            for (int i = currentCount + 1; i <= newCount; i++) {
                ArticleInstance instance = new ArticleInstance();
                instance.setArticle(article);
                instance.setStatus(Status.AVAILABLE);
                instance.setInventoryNumber("ART-" + article.getId() + "-" + i);
                articleInstanceRepo.save(instance);
            }
        }
        else if(newCount < currentCount) {
            int diff = currentCount - newCount;
            List<ArticleInstance> availableInstances = article.getArticleInstances().stream()
                    .filter(instance -> instance.getStatus() == Status.AVAILABLE)
                    .toList();
            int removed = 0;
            for (ArticleInstance instance : availableInstances) {
                if(removed >= diff) break;
                articleInstanceRepo.delete(instance);
                removed++;
            }
            // TODO: throw error and inform user
        }
    }

}*/
