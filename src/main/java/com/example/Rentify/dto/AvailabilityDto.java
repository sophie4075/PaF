package com.example.Rentify.dto;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class AvailabilityDto {
    private boolean available;
    private BigDecimal totalPrice;

    public AvailabilityDto(boolean available, BigDecimal totalPrice) {
        this.available = available;
        this.totalPrice = totalPrice;
    }

    public boolean isAvailable() {
        return available;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("available", available);
        map.put("totalPrice", totalPrice);
        return map;
    }
}
