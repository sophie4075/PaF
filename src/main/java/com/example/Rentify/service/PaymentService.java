package com.example.Rentify.service;

import com.example.Rentify.entity.Payment;
import com.example.Rentify.entity.PaymentStatus;
import com.example.Rentify.entity.Rental;
import com.example.Rentify.repo.PaymentRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {
    private final PaymentRepo paymentRepo;

    public PaymentService(PaymentRepo paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    public Payment makePayment(Payment payment) {
        try {
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaymentDate(LocalDateTime.now());
            return paymentRepo.save(payment);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to process the payment: " + e.getMessage());
        }
    }

    public Payment confirmPayment(Long paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment with ID " + paymentId + " not found"));

        if (payment.getStatus() == PaymentStatus.CANCELLED) {
            throw new IllegalStateException("Cannot confirm a cancelled payment");
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        return paymentRepo.save(payment);
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepo.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    }
}



