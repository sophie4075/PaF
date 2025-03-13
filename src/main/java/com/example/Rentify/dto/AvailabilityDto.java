package com.example.Rentify.dto;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AvailabilityDto {
    private boolean available;
    private BigDecimal totalPrice;
    private List<Long> availableInstanceNumbers;

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

    public List<Long> getAvailableInstanceNumbers() {
        return availableInstanceNumbers;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("available", available);
        map.put("totalPrice", totalPrice);
        map.put("availableInstances", availableInstanceNumbers);
        return map;
    }

    public void setAvailableInstanceNumbers(List<Long> availableInstanceNumbers) {
        this.availableInstanceNumbers = availableInstanceNumbers;
    }
}
