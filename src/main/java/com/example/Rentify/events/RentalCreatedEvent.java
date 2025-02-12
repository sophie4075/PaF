package com.example.Rentify.events;

import com.example.Rentify.entity.Rental;

public class RentalCreatedEvent {
    private final Rental rental;

    public RentalCreatedEvent(Rental rental) {
        this.rental = rental;
    }

    public Rental getRental() {
        return rental;
    }
}