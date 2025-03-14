package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_instance_id", nullable = false)
    private ArticleInstance articleInstance;

    private LocalDateTime reservationTime;

    private LocalDateTime expiryTime;


    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
}

