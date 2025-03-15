package com.example.Rentify.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AdminRentalInfoDto {
    private Long rentalPositionId;
    private LocalDate rentalStart;
    private LocalDate rentalEnd;
    private BigDecimal positionPrice;
    private String userEmail;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String articleDesignation;
    private String articleInstanceInventoryNumber;


    public AdminRentalInfoDto(Long rentalPositionId, LocalDate rentalStart, LocalDate rentalEnd, BigDecimal positionPrice,
                              String userEmail, Long userId, String userFirstName, String userLastName, String articleDesignation, String articleInstanceInventoryNumber) {
        this.rentalPositionId = rentalPositionId;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.positionPrice = positionPrice;
        this.userEmail = userEmail;
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.articleDesignation = articleDesignation;
        this.articleInstanceInventoryNumber = articleInstanceInventoryNumber;
    }


    public Long getRentalPositionId() {
        return rentalPositionId;
    }

    public void setRentalPositionId(Long rentalPositionId) {
        this.rentalPositionId = rentalPositionId;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getArticleDesignation() {
        return articleDesignation;
    }

    public void setArticleDesignation(String articleDesignation) {
        this.articleDesignation = articleDesignation;
    }

    public String getArticleInstanceInventoryNumber() {
        return articleInstanceInventoryNumber;
    }

    public void setArticleInstanceInventoryNumber(String articleInstanceInventoryNumber) {
        this.articleInstanceInventoryNumber = articleInstanceInventoryNumber;
    }

    public String getUserFirstName() {
        return userFirstName;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }
}
