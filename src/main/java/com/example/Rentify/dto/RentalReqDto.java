package com.example.Rentify.dto;

import com.example.Rentify.entity.Rental;
import java.time.LocalDate;
import java.util.List;

public class RentalReqDto {
    private Rental rental;
    private List<ArticleRentalReqDto> articleRentals;

    public Rental getRental() {
        return rental;
    }
    public void setRental(Rental rental) {
        this.rental = rental;
    }
    public List<ArticleRentalReqDto> getArticleRentals() {
        return articleRentals;
    }
    public void setArticleRentals(List<ArticleRentalReqDto> articleRentals) {
        this.articleRentals = articleRentals;
    }

    public static class ArticleRentalReqDto {
        private Long articleId;
        private LocalDate rentalStart;
        private LocalDate rentalEnd;
        private int quantity;

        public Long getArticleId() {
            return articleId;
        }
        public void setArticleId(Long articleId) {
            this.articleId = articleId;
        }
        public LocalDate getRentalStart() {
            return rentalStart;
        }
        public void setRentalStart(LocalDate rentalStart) {
            this.rentalStart = rentalStart;
        }
        public LocalDate getRentalEnd() {
            return rentalEnd;
        }
        public void setRentalEnd(LocalDate rentalEnd) {
            this.rentalEnd = rentalEnd;
        }
        public int getQuantity() {
            return quantity;
        }
        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}


