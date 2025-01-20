package com.example.Rentify.dto;

import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    private String companyName;
    private String vatId;
}
