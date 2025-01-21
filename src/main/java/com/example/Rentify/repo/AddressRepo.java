package com.example.Rentify.repo;

import com.example.Rentify.entity.Address;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * The AddressRepo interface provides CRUD operations for the Address entity
 */

@Repository
public interface AddressRepo extends CrudRepository<Address, Long> {
    Optional<Address> findFirstByStreetAndPostalCodeAndCityAndStateAndCountry(
            String street, String postalCode, String city, String state, String country);
}

