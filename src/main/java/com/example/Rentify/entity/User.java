package com.example.Rentify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The User entity represents a user in the system.
 * It is annotated with JPA and Lombok annotations for database mapping and boilerplate code reduction.
 */

@NoArgsConstructor
@Getter
@Setter
@Entity

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Primary key for the User entity
    private int id;

    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    @Embedded
    // Embedded address object containing user's address details
    private Address address;

    @Enumerated(EnumType.STRING)
    // Enum representing the role of the user (e.g., CLIENT, STAFF, ADMIN)
    private Role role;

}
