package com.example.Rentify.dto;
import com.example.Rentify.entity.Address;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@NoArgsConstructor
public class RegisterRequest {


    private String firstName;
    private String lastName;


    private String email;
    private String password;

    private BusinessDetailsDto businessDetailsDto;

    @NotNull
    private AddressDto addressDto;
}

