package com.example.Rentify.service;

import com.example.Rentify.entity.Address;
import com.example.Rentify.repo.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepo addressRepo;

    @Autowired
    public AddressService(AddressRepo addressRepo) {
        this.addressRepo = addressRepo;
    }


    /**
     * Create a new address.
     * @param address The address entity to create.
     * @return The created address.
     */
    public Address createAddress(Address address) {
        return addressRepo.save(address);
    }

    /**
     * Retrieve an address by ID.
     * @param id Address ID.
     * @return The address entity.
     * @throws IllegalArgumentException if the address is not found.
     */
    public Address getAddressById(Long id) {
        return addressRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address with ID " + id + " not found"));
    }

    /**
     * Retrieve all addresses.
     * @return A list of all addresses.
     */
    public List<Address> getAllAddresses() {
        return (List<Address>) addressRepo.findAll();
    }

    /**
     * Update an existing address.
     * @param id The ID of the address to update.
     * @param updatedAddress The new address details.
     * @return The updated address entity.
     * @throws RuntimeException if the address is not found.
     */
    public Address updateAddress(Long id, Address updatedAddress) {
        Address existingAddress = addressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        existingAddress.setStreet(updatedAddress.getStreet());
        existingAddress.setCity(updatedAddress.getCity());
        existingAddress.setState(updatedAddress.getState());
        existingAddress.setPostalCode(updatedAddress.getPostalCode());
        existingAddress.setCountry(updatedAddress.getCountry());

        return addressRepo.save(existingAddress);
    }

    /**
     * Delete an address by ID.
     * @param id Address ID.
     */
    public void deleteAddressById(Long id) {
        if (!addressRepo.existsById(id)) {
            throw new IllegalArgumentException("Address not found");
        }
        addressRepo.deleteById(id);
    }


}
