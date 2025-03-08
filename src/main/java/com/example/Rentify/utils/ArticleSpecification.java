package com.example.Rentify.utils;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Category;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

public class ArticleSpecification {
    public static Specification<Article> hasPriceBetween(double minPrice, double maxPrice) {
        return (Root<Article> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
                cb.between(root.get("grundpreis"), minPrice, maxPrice);
    }

    //TODO!
    /*public static Specification<Article> isAvailableBetween(LocalDate startDate, LocalDate endDate) {

        return (Root<Article> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            assert query != null;
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<?> rentalPos = subquery.from();
            subquery.select(rentalPos.get("id"))
                    .where(
                            cb.equal(rentalPos.get("article"), root),
                            cb.lessThan(rentalPos.get("rentalStart"), endDate),
                            cb.greaterThan(rentalPos.get("rentalEnd"), startDate)
                    );
            return cb.not(cb.exists(subquery));
        };
    } */

    public static Specification<Article> hasCategory(List<Long> categoryIds) {
        return (Root<Article> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Join<Article, Category> join = root.join("categories", JoinType.LEFT);
            Predicate directMatch = join.get("id").in(categoryIds);
            Predicate parentMatch = cb.and(
                    cb.isNotNull(join.get("parent")),
                    join.get("parent").get("id").in(categoryIds)
            );
            return cb.or(directMatch, parentMatch);
        };
    }
}
