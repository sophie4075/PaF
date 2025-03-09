package com.example.Rentify.messengerBot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BotConfig {

    @Bean
    public MessengerBot messengerBot(@Value("${telegram.bot.token}") String botToken) {
        return new MessengerBot(botToken);
    }
}
