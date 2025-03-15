package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private RentalStatus rentalStatus;
    @Getter
    private BigDecimal totalPrice;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @Getter
    private User user;

}
