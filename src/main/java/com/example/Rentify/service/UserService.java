package com.example.Rentify.service;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
     *
     * @param userRepository User repository.
     */

    @Autowired
    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
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

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                //TODO Custom Exception -> RunTime might not be ideal
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setBillingAddress(updatedUser.getBillingAddress());
        existingUser.setShippingAddress(updatedUser.getShippingAddress());

        return userRepository.save(existingUser);
    }


    /**
     * Retrieve a user by ID.
     *
     * @param id User ID.
     * @return The user entity.
     * @throws RuntimeException if the user is not found.
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                //TODO Custom Exception -> RunTimeException might not be ideal
                // + Think about more generic error messages to avoid exposing sensitive information to attackers
                .orElseThrow(() -> new IllegalArgumentException("User could not be retrieved"));
    }

    /**
     * Retrieve all users.
     * @return A list of all users.
     */
    public List<User> getAllUsers() {
        Iterable<User> users = userRepository.findAll();
        return (List<User>) users;
    }

    public List<User> findUsers(Long idFilter) {
        return idFilter == null
                ? (List<User>) userRepository.findAll()
                : userRepository.findById(idFilter)
                .map(List::of)
                .orElseGet(List::of);
    }


    /**
     * Delete a user by ID.
     * @param id User ID.
     */
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Retrieve the billing address of a user by user ID.
     * @param userId The user ID.
     * @return The billing address.
     * @throws RuntimeException if the user is not found.
     */
    public Address getBillingAddressByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No results found"));
        return user.getBillingAddress();
    }

    /**
     * Retrieve the shipping address of a user by user ID.
     * @param userId The user ID.
     * @return The shipping address.
     * @throws RuntimeException if the user is not found.
     */
    public Address getShippingAddressByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No results found"));
        return user.getShippingAddress();
    }

    //extend with further operations when needed, remember to updated Controller as well
}
