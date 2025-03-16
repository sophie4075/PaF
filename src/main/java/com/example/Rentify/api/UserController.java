package com.example.Rentify.api;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;
import com.example.Rentify.service.User.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(userServiceImpl.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userServiceImpl.updateUser(id, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userServiceImpl.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userServiceImpl.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{userId}/billing-address")
    public ResponseEntity<Address> getBillingAddress(@PathVariable Long userId) {
        return ResponseEntity.ok(userServiceImpl.getBillingAddressByUserId(userId));
    }


    @GetMapping("/{userId}/shipping-address")
    public ResponseEntity<Address> getShippingAddress(@PathVariable Long userId) {
        return ResponseEntity.ok(userServiceImpl.getShippingAddressByUserId(userId));
    }


}
