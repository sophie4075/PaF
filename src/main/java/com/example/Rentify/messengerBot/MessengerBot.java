package com.example.Rentify.messengerBot;

import com.example.Rentify.entity.User;
import com.example.Rentify.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Component
public class MessengerBot extends TelegramLongPollingBot {

    private final String botToken;
    private final UserService userService;

    public MessengerBot(@Value("${telegram.bot.token}") String botToken, UserService userService) {
        super(botToken);
        this.botToken = botToken;
        this.userService = userService;

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
            System.out.println("Chat ID: " + chatId + " Message: " + update.getMessage().getText());
            String messageText = update.getMessage().getText().trim();

            if (messageText.equalsIgnoreCase("/start")) {
                handleStartCommand(chatId);
            } else if (messageText.equalsIgnoreCase("/stop")) {
                handleStopCommand(chatId);
            } else if (messageText.equalsIgnoreCase("/relink")) {
                removeChatId(chatId);
            } else if (isValidEmail(messageText)) {
                linkChatIdToUser(chatId, messageText);
            } else {
                sendMessage(chatId, messageText + " is not a valid command. Send /start to start.");
            }
        }
    }

    private void handleStartCommand(String chatId) {
        User user = userService.getUserByChatId(chatId);
        if (user == null) {
            sendMessage(chatId, "You are not registered yet. Please enter your email to link your account.");
        } else {
            sendMessage(chatId, "Welcome back! You are already registered. Send relink to link a new account.");
        }
    }

    private void handleStopCommand(String chatId) {
        User user = userService.getUserByChatId(chatId);
        if (user != null) {
            userService.updateChatId(user.getId(), null);
            sendMessage(chatId, "You have unsubscribed from notifications.");
        } else {
            sendMessage(chatId, "You were not subscribed.");
        }
    }

    public void removeChatId(String chatId) {
        User user = userService.getUserByChatId(chatId);
        if (user != null) {
            userService.updateChatId(user.getId(), null);
            sendMessage(chatId, "Your Telegram chat link has been removed. You will no longer receive notifications. Enter new email adrees to resubscribe");
        } else {
            sendMessage(chatId, "No linked Rentify account found for this chat.");
        }
    }


    public void linkChatIdToUser(String chatId, String email) {
        User user = userService.getUserByChatId(chatId);
        if (user == null) {
            user = userService.getUserByEmail(email);
            if (user != null) {
                userService.updateChatId(user.getId(), chatId);
                sendMessage(chatId, "Your Rentify account has been linked to this Telegram chat.");
            } else {
                sendMessage(chatId, "No Rentify account found with this email.");
            }
        } else {
            sendMessage(chatId, "You are already linked. Send /relink to link a new account.");
        }
    }

    public void sendMessage(String chatId, String text) {
        System.out.println("Sending message to Telegram: " + text);
        System.out.println("Chat ID: " + chatId);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(text);

        try {
            execute(message);
            System.out.println("Message sent successfully to Telegram.");
        } catch (TelegramApiException e) {
            e.printStackTrace();
            System.out.println("Error sending message to Telegram: " + e.getMessage());
        }
    }


    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }


    public void sendReminder(String chatId, String artikelName) {
        sendMessage(chatId, "Reminder: Your rental for '" + artikelName + "' is due soon!");
    }

    public void sendRentalInfo(String chatId, String ausleiheDetails) {
        sendMessage(chatId, "Rental Info: " + ausleiheDetails);
    }
}
