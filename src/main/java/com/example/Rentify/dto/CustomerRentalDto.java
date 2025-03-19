package com.example.Rentify.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CustomerRentalDto {
    private Long rentalId;
    private Long rentalPositionId;
    private String articleDesignation;
    private String inventoryNumber;
    private LocalDate rentalStart;
    private LocalDate rentalEnd;
    private String status;
    private BigDecimal positionPrice;
    private BigDecimal totalRentalPrice;

    public CustomerRentalDto(Long rentalId, Long rentalPositionId, String articleDesignation, String inventoryNumber,
                                 LocalDate rentalStart, LocalDate rentalEnd, String status,
                                 BigDecimal positionPrice, BigDecimal totalRentalPrice) {
        this.rentalId = rentalId;
        this.rentalPositionId = rentalPositionId;
        this.articleDesignation = articleDesignation;
        this.inventoryNumber = inventoryNumber;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
        this.positionPrice = positionPrice;
        this.totalRentalPrice = totalRentalPrice;
    }

    public Long getRentalId() {
        return rentalId;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public Long getRentalPositionId() {
        return rentalPositionId;
    }

    public void setRentalPositionId(Long rentalPositionId) {
        this.rentalPositionId = rentalPositionId;
    }

    public String getArticleDesignation() {
        return articleDesignation;
    }

    public void setArticleDesignation(String articleDesignation) {
        this.articleDesignation = articleDesignation;
    }

    public String getInventoryNumber() {
        return inventoryNumber;
    }

    public void setInventoryNumber(String inventoryNumber) {
        this.inventoryNumber = inventoryNumber;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getPositionPrice() {
        return positionPrice;
    }

    public void setPositionPrice(BigDecimal positionPrice) {
        this.positionPrice = positionPrice;
    }

    public BigDecimal getTotalRentalPrice() {
        return totalRentalPrice;
    }

    public void setTotalRentalPrice(BigDecimal totalRentalPrice) {
        this.totalRentalPrice = totalRentalPrice;
    }
}

