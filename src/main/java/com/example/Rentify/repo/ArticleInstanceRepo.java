package com.example.Rentify.repo;

import com.example.Rentify.entity.ArticleInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleInstanceRepo extends JpaRepository<ArticleInstance, Long> {

}
