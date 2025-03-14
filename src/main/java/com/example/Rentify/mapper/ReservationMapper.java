package com.example.Rentify.mapper;

import com.example.Rentify.dto.ReservationDto;
import com.example.Rentify.entity.Reservation;

public class ReservationMapper {
    public static ReservationDto toDTO(Reservation reservation) {
        if (reservation == null) return null;
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        dto.setUserId(reservation.getUser() != null ? reservation.getUser().getId() : null);
        dto.setArticleInstanceId(reservation.getArticleInstance() != null ? reservation.getArticleInstance().getId() : null);
        dto.setReservationTime(reservation.getReservationTime());
        dto.setExpiryTime(reservation.getExpiryTime());
        dto.setStatus(reservation.getStatus());
        return dto;
    }
}

