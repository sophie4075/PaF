package com.example.Rentify;

import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.User;
import com.example.Rentify.events.RentalCreatedEvent;
import com.example.Rentify.listener.NotificationListener;
import com.example.Rentify.messengerBot.MessengerBot;
import com.example.Rentify.service.user.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.event.RecordApplicationEvents;

import java.math.BigDecimal;

import static org.mockito.Mockito.*;

@SpringBootTest
@RecordApplicationEvents
public class RentalNotificationListenerTest {

    @MockBean
    private MessengerBot messengerBot; // Mocked MessengerBot for testing

    @Mock
    private UserServiceImpl userServiceImpl;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private NotificationListener notificationListener;

    @Captor
    private ArgumentCaptor<String> chatIdCaptor;

    @Captor
    private ArgumentCaptor<String> ausleiheDetailsCaptor;

    private User testUser;
    private Rental testRental;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Max");
        testUser.setLastName("Mustermann");
        testUser.setEmail("max@mustermann.com");
        testUser.setChatId("493192316");

        testRental = new Rental();
        testRental.setId(101L);
        testRental.setUser(testUser);
        testRental.setTotalPrice(BigDecimal.valueOf(199.99));

        when(userServiceImpl.getUserById(testUser.getId())).thenReturn(testUser);
    }

    /**
     * Unit test to verify that the MessengerBot's senRentalInfo method is called correctly.
     */
    @Test
    void testSendRentalInfoOnRentalCreated() {
        eventPublisher.publishEvent(new RentalCreatedEvent(testRental));

        verify(messengerBot, times(1)).sendRentalInfo(chatIdCaptor.capture(), ausleiheDetailsCaptor.capture());

        String capturedChatId = chatIdCaptor.getValue();
        String capturedMessage = ausleiheDetailsCaptor.getValue();

        System.out.println("Mock test: Chat ID -> " + capturedChatId);
        System.out.println("Mock test: Sent message -> " + capturedMessage);

        assert capturedChatId.equals(testUser.getChatId()) : "Chat ID does not match";
        assert capturedMessage.contains("Hallo Max") : "Name is missing";
        assert capturedMessage.contains("Deine Ausleihe wurde erfolgreich erstellt.") : "Message text is incorrect";
        assert capturedMessage.contains("Gesamtpreis: 199.99€") : "Price is incorrect";
    }
}
