package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentMethod;

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "rental_id", nullable = false)
    private Rental rental;
}

