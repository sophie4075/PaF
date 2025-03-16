package com.example.Rentify.api;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;
import com.example.Rentify.service.user.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Rentify.utils.ResponseHandler;


/**
 * The UserController class defines REST endpoints for User-related operations.
 */

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserServiceImpl userServiceImpl;

    public UserController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseHandler.handle(() -> userServiceImpl.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseHandler.handle(() -> userServiceImpl.updateUser(id, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseHandler.handle(() -> userServiceImpl.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return ResponseHandler.handle(() -> {
            userServiceImpl.deleteUserById(id);
            return null;
        });
    }


    @GetMapping("/{userId}/billing-address")
    public ResponseEntity<Address> getBillingAddress(@PathVariable Long userId) {
        return ResponseHandler.handle(() -> userServiceImpl.getBillingAddressByUserId(userId));
    }


    @GetMapping("/{userId}/shipping-address")
    public ResponseEntity<Address> getShippingAddress(@PathVariable Long userId) {
        return ResponseHandler.handle(() -> userServiceImpl.getShippingAddressByUserId(userId));
    }


}
