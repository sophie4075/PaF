package com.example.Rentify.events;

import com.example.Rentify.entity.User;

public class UserUpdatedEvent {
    private final User user;

    public UserUpdatedEvent(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
