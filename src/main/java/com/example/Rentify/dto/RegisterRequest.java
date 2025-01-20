package com.example.Rentify.dto;
import com.example.Rentify.entity.Address;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@NoArgsConstructor
public class RegisterRequest {


    private String FirstName;
    private String LastName;


    private String email;
    private String password;

    @NotNull
    private AddressDto addressDto;
}
