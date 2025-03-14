package com.example.Rentify.dto;

import java.math.BigDecimal;
import java.util.List;

public class RentalDto {
    private Long id;
    private String rentalStatus;
    private BigDecimal totalPrice;
    private UserDto user;
    private List<RentalPositionDto> rentalPositions;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRentalStatus() {
        return rentalStatus;
    }

    public void setRentalStatus(String rentalStatus) {
        this.rentalStatus = rentalStatus;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public List<RentalPositionDto> getRentalPositions() {
        return rentalPositions;
    }

    public void setRentalPositions(List<RentalPositionDto> rentalPositions) {
        this.rentalPositions = rentalPositions;
    }
}
