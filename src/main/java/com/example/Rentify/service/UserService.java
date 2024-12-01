package com.example.Rentify.service;

import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * The UserService class provides the business logic for User-related operations.
 */

@Service

public class UserService {
    private final UserRepo userRepository;

    /**
     * Constructor for injecting the User repository.
     * @param userRepository User repository.
     */
    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Create a new user.
     * @param user The user entity to create.
     * @return The created user.
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Retrieve a user by ID.
     * @param id User ID.
     * @return The user entity.
     * @throws RuntimeException if the user is not found.
     */
    public User getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    /**
     * Delete a user by ID.
     * @param id User ID.
     */
    public void deleteUserById(int id) {
        userRepository.deleteById(id);
    }

    //extend with further operations when needed, remember to updated Controller as well
}
