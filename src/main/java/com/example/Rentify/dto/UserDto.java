package com.example.Rentify.dto;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Role role;

    private AddressDto billingAddress;
    private AddressDto shippingAddress;
}
