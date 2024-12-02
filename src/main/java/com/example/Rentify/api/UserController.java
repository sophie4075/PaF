package com.example.Rentify.api;

import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.User;
import com.example.Rentify.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The UserController class defines REST endpoints for User-related operations.
 */

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{userId}/billing-address")
    public ResponseEntity<Address> getBillingAddress(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getBillingAddressByUserId(userId));
    }


    @GetMapping("/{userId}/shipping-address")
    public ResponseEntity<Address> getShippingAddress(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getShippingAddressByUserId(userId));
    }


}
