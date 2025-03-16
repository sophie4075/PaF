package com.example.Rentify.service.User;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;

import java.util.List;

public interface UserService {
    User createUser(User user);
    User updateUser(Long id, User updatedUser);
    User getUserById(Long id);
    List<User> getAllUsers();
    List<User> findUsers(Long idFilter);
    void deleteUserById(Long id);
    Address getBillingAddressByUserId(Long userId);
    Address getShippingAddressByUserId(Long userId);
    User getUserByChatId(String chatId);
    void updateChatId(Long userId, String chatId);
    User getUserByEmail(String email);
}

