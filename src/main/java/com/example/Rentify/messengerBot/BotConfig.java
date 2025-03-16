package com.example.Rentify.messengerBot;

import com.example.Rentify.service.Rental.RentalServiceImpl;
import com.example.Rentify.service.User.UserServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BotConfig {

    @Bean
    public MessengerBot messengerBot(
            @Value("${telegram.bot.token}") String botToken,
            UserServiceImpl userServiceImpl,
            RentalServiceImpl rentalServiceImpl) {
        return new MessengerBot(botToken, userServiceImpl, rentalServiceImpl);
    }
}
