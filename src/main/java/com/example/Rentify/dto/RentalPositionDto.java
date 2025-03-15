package com.example.Rentify.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RentalPositionDto {
    private Long id;
    private LocalDate rentalStart;
    private LocalDate rentalEnd;
    private BigDecimal positionPrice;
    private Long articleInstanceId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getPositionPrice() {
        return positionPrice;
    }

    public void setPositionPrice(BigDecimal positionPrice) {
        this.positionPrice = positionPrice;
    }

    public Long getArticleInstanceId() {
        return articleInstanceId;
    }

    public void setArticleInstanceId(Long articleInstanceId) {
        this.articleInstanceId = articleInstanceId;
    }


}
