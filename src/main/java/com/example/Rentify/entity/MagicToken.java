package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "tokens")
@Getter
@Setter
public class MagicToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private String email;

    @Column(name = "created_at")
    private Instant created;
}

