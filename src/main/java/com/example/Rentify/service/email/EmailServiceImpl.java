package com.example.Rentify.service.email;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends an E-Mail.
     *
     * @param to      Receiver address
     * @param subject subject of E-Mail
     * @param text    content of E-Mail
     */
    @Override
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        //mailSender.send(message);
        System.out.println("Email sending is disabled for development.");
    }

    @Override
    public void sendMagicLink(String email, String link, String subject, String bodyText){

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(bodyText + "\n\n"+ link + "\n\nThe link is valid for 15 minutes.", false);

            mailSender.send(message);

            //System.out.println(message);
        } catch (Exception e) {
            e.printStackTrace(); // Logging etc.
        }



    }
}
