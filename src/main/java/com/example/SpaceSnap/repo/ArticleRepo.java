package com.example.SpaceSnap.repo;

import com.example.SpaceSnap.entity.Article;
import org.springframework.data.repository.CrudRepository;

public interface ArticleRepo extends CrudRepository<Article, Long> {
}
