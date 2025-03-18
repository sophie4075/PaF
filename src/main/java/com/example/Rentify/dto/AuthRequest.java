package com.example.Rentify.dto;/*package com.example.Rentify.dto;

import lombok.Data;

@Data
public class AuthRequest {

    String email;
    String password;

}*/

import lombok.Data;

@Data
public class AuthRequest {
    private String email;

    public AuthRequest() {}

    public AuthRequest(String email) {
        this.email = email;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

