package com.example.Rentify.service.Address;

import com.example.Rentify.entity.Address;

import java.util.List;

public interface AddressService {

    Address createAddress(Address address);
    Address getAddressById(Long id);
    List<Address> getAllAddresses();
    Address updateAddress(Long id, Address updatedAddress);
    void deleteAddressById(Long id);
}

