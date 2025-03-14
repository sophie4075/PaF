package com.example.Rentify.utils;

import com.example.Rentify.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

public class ArticleSpecification {
    public static Specification<Article> hasPriceBetween(double minPrice, double maxPrice) {
        return (Root<Article> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
                cb.between(root.get("grundpreis"), minPrice, maxPrice);
    }

    public static Specification<Article> isAvailableBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            // Inner join to Article Instances
            Join<Article, ArticleInstance> instanceJoin = root.join("articleInstances", JoinType.INNER);
            // Get Available Instances
            // (Hier gehen wir davon aus, dass Status.AVAILABLE in deinem Enum existiert)
            var availableStatus = cb.equal(instanceJoin.get("status"), Status.AVAILABLE);

            assert query != null;
            Subquery<Long> rentalSubquery = query.subquery(Long.class);
            Root<RentalPosition> rentalPosRoot = rentalSubquery.from(RentalPosition.class);
            rentalSubquery.select(rentalPosRoot.get("id"));
            rentalSubquery.where(
                    cb.equal(rentalPosRoot.get("articleInstance"), instanceJoin),
                    cb.lessThan(rentalPosRoot.get("rentalStart"), endDate),
                    cb.greaterThan(rentalPosRoot.get("rentalEnd"), startDate)
            );


            var notBooked = cb.not(cb.exists(rentalSubquery));

            return cb.and(availableStatus, notBooked);
        };
    }

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
