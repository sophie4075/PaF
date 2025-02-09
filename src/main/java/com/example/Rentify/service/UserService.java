package com.example.Rentify.service;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;
import com.example.Rentify.events.UserUpdatedEvent;
import com.example.Rentify.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher; // Neuer Import für Event Publishing
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * The UserService class provides the business logic for User-related operations.
 */
@Service
public class UserService {
    private final UserRepo userRepository;
    private final ApplicationEventPublisher eventPublisher;  // ApplicationEventPublisher als Abhängigkeit

    /**
     * Constructor for injecting the User repository and ApplicationEventPublisher.
     *
     * @param userRepository User repository.
     * @param eventPublisher ApplicationEventPublisher for publishing events.
     */
    @Autowired
    public UserService(UserRepo userRepository, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Create a new user.
     *
     * @param user The user entity to create.
     * @return The created user.
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Update an existing user.
     *
     * @param id The ID of the user to update.
     * @param updatedUser The user entity with updated information.
     * @return The updated user.
     */
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setBillingAddress(updatedUser.getBillingAddress());
        existingUser.setShippingAddress(updatedUser.getShippingAddress());

        User savedUser = userRepository.save(existingUser);

        // Statt einer direkten Benachrichtigung wird nun ein Event veröffentlicht
        eventPublisher.publishEvent(new UserUpdatedEvent(savedUser));

        return savedUser;
    }

    /**
     * Retrieve a user by ID.
     *
     * @param id User ID.
     * @return The user entity.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User could not be retrieved"));
    }

    /**
     * Retrieve all users.
     *
     * @return A list of all users.
     */
    public List<User> getAllUsers() {
        Iterable<User> users = userRepository.findAll();
        return (List<User>) users;
    }

    /**
     * Find users with an optional ID filter.
     *
     * @param idFilter The ID filter to apply.
     * @return A list of users matching the filter.
     */
    public List<User> findUsers(Long idFilter) {
        return idFilter == null
                ? (List<User>) userRepository.findAll()
                : userRepository.findById(idFilter)
                .map(List::of)
                .orElseGet(List::of);
    }

    /**
     * Delete a user by ID.
     *
     * @param id User ID.
     */
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User with ID " + id + " not found");
        }
        userRepository.deleteById(id);
    }

    /**
     * Retrieve the billing address of a user by user ID.
     *
     * @param userId The user ID.
     * @return The billing address.
     * @throws IllegalArgumentException if the user is not found.
     */
    public Address getBillingAddressByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No results found"));
        return user.getBillingAddress();
    }

    /**
     * Retrieve the shipping address of a user by user ID.
     *
     * @param userId The user ID.
     * @return The shipping address.
     * @throws IllegalArgumentException if the user is not found.
     */
    public Address getShippingAddressByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No results found"));
        return user.getShippingAddress();
    }
}
