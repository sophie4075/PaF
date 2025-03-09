package com.example.Rentify.messengerBot;

import com.example.Rentify.service.RentalService;
import com.example.Rentify.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BotConfig {

    @Bean
    public MessengerBot messengerBot(
            @Value("${telegram.bot.token}") String botToken,
            UserService userService,
            RentalService rentalService) {
        return new MessengerBot(botToken, userService, rentalService);
    }
}
