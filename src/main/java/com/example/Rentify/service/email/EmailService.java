package com.example.Rentify.service.email;

public interface EmailService {
    void sendEmail(String to, String subject, String text);
    void sendMagicLink(String email, String link, String subject, String bodyText);
}
