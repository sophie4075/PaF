package com.example.Rentify.api;

import com.example.Rentify.entity.Address;
import com.example.Rentify.service.address.AddressService;
import com.example.Rentify.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        return ResponseHandler.handleWithStatus(() -> addressService.createAddress(address), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        return ResponseHandler.handle(() -> addressService.updateAddress(id, address));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        return ResponseHandler.handle(() -> addressService.getAddressById(id));
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses() {
        return ResponseHandler.handle(addressService::getAllAddresses);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        return ResponseHandler.handleVoid(() -> addressService.deleteAddressById(id));
    }
}

