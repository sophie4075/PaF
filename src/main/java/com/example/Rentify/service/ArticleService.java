package com.example.Rentify.service;

import com.example.Rentify.entity.Article;
import com.example.Rentify.repo.ArticleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepo articleRepo;

    public ArticleService(ArticleRepo articleRepo) {
        this.articleRepo = articleRepo;
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
                    article.setStueckzahl(updatedArticle.getStueckzahl());
                    article.setGrundpreis(updatedArticle.getGrundpreis());
                    article.setBildUrl(updatedArticle.getBildUrl());
                    return articleRepo.save(article);
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
}
