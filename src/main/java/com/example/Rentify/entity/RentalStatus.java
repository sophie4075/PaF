package com.example.Rentify.entity;
/**
 * Defines the state of a rental
 * - PENDING: The rental request has been submitted but is waiting for approval (e.g. Payment).
 * - ACTIVE: The rental has been approved and is currently ongoing.
 * - CANCELLED: The rental has been canceled and is no longer needed.
 */
public enum RentalStatus {
    PENDING,
    ACTIVE,
    CANCELLED,
}
