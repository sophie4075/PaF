package com.example.Rentify.service.auth;

import com.example.Rentify.dto.AddressDto;
import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.Role;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepo userRepo;

    @Override
    public UserDto createCustomer(RegisterRequest registerRequest){
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        // TODO: Implement Bcrypt
        user.setPassword(registerRequest.getPassword());


        user.setRole(Role.CLIENT);


        Address address = new Address();
        AddressDto addressDto = registerRequest.getAddressDto();


        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setPostalCode(addressDto.getPostalCode());
        address.setCountry(addressDto.getCountry());

        address.setCompanyName(addressDto.getCompanyName());
        address.setVatId(addressDto.getVatId());

        user.setBillingAddress(address);
        user.setBillingAddress(address);


        User createdUser = userRepo.save(user);

        // Map Results into UserDto
        UserDto userDto = new UserDto();
        userDto.setId(createdUser.getId());
        userDto.setFirstName(createdUser.getFirstName());
        userDto.setLastName(createdUser.getLastName());
        userDto.setEmail(createdUser.getEmail());
        userDto.setRole(createdUser.getRole());


        userDto.setBillingAddress(convertAddressToDto(createdUser.getBillingAddress()));
        userDto.setShippingAddress(convertAddressToDto(createdUser.getShippingAddress()));

        return userDto;
    }

    @Override
    public boolean hasCustomerWithEmail(String email) {
        return userRepo.findFirstByEmail(email).isPresent();
    }


    private AddressDto convertAddressToDto(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto dto = new AddressDto();
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setCompanyName(address.getCompanyName());
        dto.setVatId(address.getVatId());
        return dto;
    }
}
