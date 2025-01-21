package com.example.Rentify.dto;

import com.example.Rentify.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// could be java records
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

    private BusinessDetailsDto businessDetails;
    private AddressDto billingAddress;
    private AddressDto shippingAddress;
}
