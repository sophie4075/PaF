package com.example.Rentify.dto;

import com.example.Rentify.entity.ReservationStatus;
import java.time.LocalDateTime;

public class ReservationDto {
    private Long id;
    private Long userId;
    private Long articleInstanceId;
    private LocalDateTime reservationTime;
    private LocalDateTime expiryTime;
    private ReservationStatus status;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getArticleInstanceId() {
        return articleInstanceId;
    }
    public void setArticleInstanceId(Long articleInstanceId) {
        this.articleInstanceId = articleInstanceId;
    }
    public LocalDateTime getReservationTime() {
        return reservationTime;
    }
    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }
    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
    public ReservationStatus getStatus() {
        return status;
    }
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}

