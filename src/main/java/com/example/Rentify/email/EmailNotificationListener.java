/*package com.example.Rentify.email;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.User;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.events.UserUpdatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationListener {

    @Autowired
    private EmailService emailService;

    /**
     * Reagiert auf ein Benutzeraktualisierungs-Event und sendet eine E-Mail an den Benutzer.
     */
   /* @EventListener
    public void handleUserUpdatedEvent(UserUpdatedEvent event) {
        User user = event.getUser();
        String to = user.getEmail();
        String subject = "Dein Benutzerprofil wurde aktualisiert";
        String text = "Hallo " + user.getFirstName() + ",\n\nDein Profil wurde aktualisiert.\n\nViele Grüße\nDein Rentify-Team";
        emailService.sendEmail(to, subject, text);
    }

    /**
     * Reagiert auf ein Ausleihe-erstellt-Event und sendet eine E-Mail.
     */
   /* @EventListener
    public void handleRentalCreatedEvent(RentalCreatedEvent event) {
        Rental rental = event.getRental();
        User user = rental.getUser();
        String to = user.getEmail();
        String subject = "Neue Ausleihe erstellt";
        String text = "Hallo " + user.getFirstName() + ",\n\nDeine Ausleihe wurde erfolgreich erstellt. Gesamtpreis: " + rental.getTotalPrice() + "€." + "\n\nViele Grüße\nDein Rentify-Team";
        emailService.sendEmail(to, subject, text);
    }
}*/
