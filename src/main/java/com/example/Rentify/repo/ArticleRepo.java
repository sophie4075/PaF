package com.example.Rentify.repo;

import com.example.Rentify.entity.Article;
import org.springframework.data.repository.CrudRepository;

public interface ArticleRepo extends CrudRepository<Article, Long> {
}
