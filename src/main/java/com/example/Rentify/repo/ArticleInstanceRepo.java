package com.example.Rentify.repo;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleInstanceRepo extends JpaRepository<ArticleInstance, Long> {

    List<ArticleInstance> findByArticle(Article article);

}
