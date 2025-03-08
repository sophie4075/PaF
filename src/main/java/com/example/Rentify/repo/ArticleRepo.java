package com.example.Rentify.repo;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ArticleRepo extends JpaRepository<Article, Long>, JpaSpecificationExecutor<Article> {

}
