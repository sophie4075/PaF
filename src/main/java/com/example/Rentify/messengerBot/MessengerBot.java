package com.example.Rentify.messengerBot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.util.ArrayList;
import java.util.List;

@Component
public class MessengerBot extends TelegramLongPollingBot {

    private final String botToken;
    private final List<String> chatIdList = new ArrayList<>();

    public MessengerBot(@Value("${telegram.bot.token}") String botToken) {
        super(botToken);
        this.botToken = botToken;

        // Register bot in TelegramBotsApi
        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(this);
            System.out.println("Telegram Bot Registered Successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error Registering Telegram Bot.");
        }
    }

    @Override
    public String getBotUsername() {
        return "RentalPaFBot";
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String chatId = update.getMessage().getChatId().toString();
            String messageText = update.getMessage().getText();

            if (messageText.equalsIgnoreCase("/start")) {
                subscribe(chatId);
                sendMessage(chatId, "Welcome! You are now subscribed to notifications.");
            } else if (messageText.equalsIgnoreCase("/stop")) {
                unsubscribe(chatId);
                sendMessage(chatId, "You have unsubscribed from notifications.");
            } else {
                sendMessage(chatId, "I received: " + messageText);
            }
        }
    }

    public void sendMessage(String chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(text);

        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public void sendReminder(String chatId, String artikelName) {
        sendMessage(chatId, "Reminder: Your rental for '" + artikelName + "' is due soon!");
    }

    public void sendAusleiheInfo(String chatId, String ausleiheDetails) {
        sendMessage(chatId, "Rental Info: " + ausleiheDetails);
    }

    public void subscribe(String chatId) {
        if (!chatIdList.contains(chatId)) {
            chatIdList.add(chatId);
        }
    }

    public void unsubscribe(String chatId) {
        chatIdList.remove(chatId);
    }
}
