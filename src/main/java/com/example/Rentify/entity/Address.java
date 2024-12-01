package com.example.Rentify.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The Address class is an embeddable entity representing a user's address.
 * It is used within the User entity.
 */

@NoArgsConstructor
@Getter
@Setter
@Embeddable

public class Address {
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
