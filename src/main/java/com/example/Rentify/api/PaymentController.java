package com.example.Rentify.api;

import com.example.Rentify.entity.Payment;
import com.example.Rentify.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create a new payment.
     * @param payment The payment details.
     * @return The created payment.
     */
    @PostMapping
    public ResponseEntity<Payment> makePayment(@RequestBody Payment payment) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.makePayment(payment));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Confirm an existing payment.
     * @param id The payment ID.
     * @return The updated payment.
     */
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(paymentService.confirmPayment(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Retrieve a payment by ID.
     * @param id The payment ID.
     * @return The payment details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

