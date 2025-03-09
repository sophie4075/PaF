package com.example.Rentify.service;

import com.example.Rentify.entity.Payment;
import com.example.Rentify.entity.PaymentStatus;
import com.example.Rentify.repo.PaymentRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepo paymentRepo;

    @InjectMocks
    private PaymentService paymentService;

    private Payment payment;

    @BeforeEach
    void setUp() {
        payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(LocalDateTime.now());
    }

    @Test
    void makePayment_ShouldSavePaymentWithPendingStatus() {
        // Arrange
        when(paymentRepo.save(any(Payment.class))).thenReturn(payment);

        // Act
        Payment result = paymentService.makePayment(new Payment());

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.PENDING, result.getStatus());
        verify(paymentRepo, times(1)).save(any(Payment.class));
    }

    @Test
    void confirmPayment_ShouldSetStatusToCompleted() {
        // Arrange
        payment.setStatus(PaymentStatus.PENDING);
        when(paymentRepo.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepo.save(any(Payment.class))).thenReturn(payment);

        // Act
        Payment result = paymentService.confirmPayment(1L);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        verify(paymentRepo, times(1)).save(payment);
    }

    @Test
    void confirmPayment_ShouldThrowException_WhenPaymentNotFound() {
        // Arrange
        when(paymentRepo.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> paymentService.confirmPayment(1L));
        assertEquals("Payment with ID 1 not found", exception.getMessage());
    }

    @Test
    void confirmPayment_ShouldThrowException_WhenPaymentCancelled() {
        // Arrange
        payment.setStatus(PaymentStatus.CANCELLED);
        when(paymentRepo.findById(1L)).thenReturn(Optional.of(payment));

        // Act & Assert
        Exception exception = assertThrows(IllegalStateException.class, () -> paymentService.confirmPayment(1L));
        assertEquals("Cannot confirm a cancelled payment", exception.getMessage());
    }
}
