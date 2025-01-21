package com.example.Rentify.dto;
import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String postalCode;
    private String city;
    private String state;
    private String country;
}
