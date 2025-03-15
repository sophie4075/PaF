package com.example.Rentify.scheduler;

import com.example.Rentify.messengerBot.MessengerBot;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    private final MessengerBot messengerBot;

    public ReminderScheduler(MessengerBot messengerBot) {
        this.messengerBot = messengerBot;
    }

    // For testing use this cron Expression to send a message every 10 seconds.
    // @Scheduled(cron = "*/10 * * * * ?")
    // Also make sure to register your chatbot in telegram to the seeded email max@mustermann.com

    // Every day at 3pm
    @Scheduled(cron = "0 0 15 * * ?", zone = "Europe/Berlin")
    public void scheduleDailyReminders() {
        messengerBot.sendRemindersForTomorrow();
    }
}