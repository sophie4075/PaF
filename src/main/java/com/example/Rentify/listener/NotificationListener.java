package com.example.Rentify.listener;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.User;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.events.UserUpdatedEvent;
import com.example.Rentify.messengerBot.MessengerBot;
import com.example.Rentify.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    @Autowired
    private EmailService emailService;

    @Autowired
    private MessengerBot messengerBot;

    /**
     * Reagiert auf ein Benutzeraktualisierungs-Event und sendet eine E-Mail an den Benutzer.
     */
    @EventListener
    public void handleUserUpdatedEvent(UserUpdatedEvent event) {
        User user = event.getUser();
        String to = user.getEmail();
        String subject = "Dein Benutzerprofil wurde aktualisiert";
        String text = "Hallo " + user.getFirstName() + ",\n\nDein Profil wurde aktualisiert.\n\nViele Grüße\nDein Rentify-Team";
        emailService.sendEmail(to, subject, text);
        System.out.println("User updated. Sent email to " + to);
    }

    /**
     * Reagiert auf ein Ausleihe-erstellt-Event und sendet eine E-Mail.
     */
    @EventListener
    public void handleRentalCreatedEvent(RentalCreatedEvent event) {
        Rental rental = event.getRental();
        User user = rental.getUser();
        String to = user.getEmail();
        String subject = "Neue Ausleihe erstellt";
        String text = "Hallo " + user.getFirstName() + ",\n\nDeine Ausleihe wurde erfolgreich erstellt. Gesamtpreis: "
                + rental.getTotalPrice() + "€." + "\n\nViele Grüße\nDein Rentify-Team";

        // Send EMail
        emailService.sendEmail(to, subject, text);
        System.out.println("Rental created. Sent email to " + to);

        // If the user has a chat id also send a telegram message
        if (user.getChatId() != null) {
            String ausleiheDetails = "Hallo " + user.getFirstName() +
                    ",\n\nDeine Ausleihe wurde erfolgreich erstellt.\nGesamtpreis: "
                    + rental.getTotalPrice() + "€.";
            messengerBot.sendRentalInfo(user.getChatId(), ausleiheDetails);
        }
    }
}
