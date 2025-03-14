package com.example.Rentify;

import com.example.Rentify.configuration.DatabaseSeeder;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public DatabaseSeeder databaseSeeder() {
        return new DatabaseSeeder(null, null, null, null, null, null, null, null) {
            @Override
            public void run(String... args) {
            }
        };
    }
}
