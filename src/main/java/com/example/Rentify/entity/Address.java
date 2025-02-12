package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity

public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String street;
    @Column(nullable = false, length = 10)
    private String postalCode;
    @Column(nullable = false, length = 100)
    private String city;
    @Column(nullable = false, length = 50)
    private String state;
    @Column(nullable = false, length = 100)
    private String country;

}

