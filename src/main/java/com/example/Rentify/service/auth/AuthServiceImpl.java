package com.example.Rentify.service.auth;

import com.example.Rentify.dto.AddressDto;
import com.example.Rentify.dto.BusinessDetailsDto;
import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.entity.Address;
import com.example.Rentify.entity.BusinessDetails;
import com.example.Rentify.entity.Role;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.repo.BusinessDetailsRepo;
import com.example.Rentify.repo.AddressRepo;

import com.example.Rentify.service.MagicLinkService;
import com.example.Rentify.service.auth.strategy.MagicLinkStrategy;
import com.example.Rentify.service.auth.strategy.RegistrationMagicLinkStrategy;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepo userRepo;
    private final AddressRepo addressRepo;
    private final BusinessDetailsRepo businessDetailsRepo;
    private final MagicLinkStrategy magicLinkStrategy;
    //TODO Don't make this accessible for everyone -> Create magic link and send credentials to owner(s)
    @PostConstruct
    public void createAdminAcc() {
        List<User> admins = userRepo.findAllByRole(Role.ADMIN);
        if (admins.isEmpty()) { // Prüft, ob noch kein Admin existiert
            User newAdmin = new User();
            newAdmin.setRole(Role.ADMIN);
            // Update Mail an den Besitzer
            newAdmin.setEmail("sophiehaack0@gmail.com");
            // TODO: Zufällige Passwortgenerierung implementieren
            newAdmin.setPassword(new BCryptPasswordEncoder().encode("admiN123!"));
            newAdmin.setEnabled(true);
            newAdmin.setFirstName("Admin");
            newAdmin.setLastName("Rentify");

            // Standardadresse setzen
            Address defaultAddress = new Address();
            defaultAddress.setStreet("Default Street");
            defaultAddress.setPostalCode("12345");
            defaultAddress.setCity("Default City");
            defaultAddress.setState("Default State");
            defaultAddress.setCountry("Default Country");

            newAdmin.setBillingAddress(defaultAddress);
            newAdmin.setShippingAddress(defaultAddress);

            // User speichern
            userRepo.save(newAdmin);
            log.info("Admin-Account erfolgreich erstellt.");
        } else {
            log.info("Admin-Account existiert bereits.");
        }
    }




    @Override
    public UserDto createCustomer(RegisterRequest registerRequest){
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(registerRequest.getPassword()));
        /*String dummyPassword = new BCryptPasswordEncoder().encode(generateDummyPassword());
        user.setPassword(dummyPassword);*/
        user.setEnabled(false);



        //user.setRole(Role.CLIENT);
        if (registerRequest.getBusinessDetailsDto() != null) {
            user.setRole(Role.BUSINESS_CLIENT);
        } else {
            user.setRole(Role.PRIVATE_CLIENT);
        }



        AddressDto addressDto = registerRequest.getAddressDto();

        Address billingAddress = addressRepo.findFirstByStreetAndPostalCodeAndCityAndStateAndCountry(
                addressDto.getStreet(),
                addressDto.getPostalCode(),
                addressDto.getCity(),
                addressDto.getState(),
                addressDto.getCountry()
        ).orElseGet(() -> {
            Address newAddress = new Address();
            newAddress.setStreet(addressDto.getStreet());
            newAddress.setPostalCode(addressDto.getPostalCode());
            newAddress.setCity(addressDto.getCity());
            newAddress.setState(addressDto.getState());
            newAddress.setCountry(addressDto.getCountry());
            return newAddress;
        });


        user.setBillingAddress(billingAddress);
        user.setShippingAddress(billingAddress);

        if (registerRequest.getBusinessDetailsDto() != null) {
            BusinessDetailsDto businessDetailsDto = registerRequest.getBusinessDetailsDto();
            BusinessDetails businessDetails = businessDetailsRepo.findFirstByCompanyNameAndVatId(
                    businessDetailsDto.getCompanyName(),
                    businessDetailsDto.getVatId()
            ).orElseGet(() -> {
                BusinessDetails newDetails = new BusinessDetails();
                newDetails.setCompanyName(businessDetailsDto.getCompanyName());
                newDetails.setVatId(businessDetailsDto.getVatId());
                return newDetails;
            });

            user.setBusinessDetails(businessDetails);
        }

        User createdUser = userRepo.save(user);
        magicLinkStrategy.sendLink(createdUser.getEmail());

        // Map Results into UserDto
        UserDto userDto = new UserDto();
        userDto.setId(createdUser.getId());
        userDto.setFirstName(createdUser.getFirstName());
        userDto.setLastName(createdUser.getLastName());
        userDto.setEmail(createdUser.getEmail());
        userDto.setRole(createdUser.getRole());

        userDto.setBillingAddress(convertAddressToDto(createdUser.getBillingAddress()));
        userDto.setShippingAddress(convertAddressToDto(createdUser.getShippingAddress()));

        if (createdUser.getBusinessDetails() != null) {
            BusinessDetailsDto businessDetailsDto = new BusinessDetailsDto();
            businessDetailsDto.setCompanyName(createdUser.getBusinessDetails().getCompanyName());
            businessDetailsDto.setVatId(createdUser.getBusinessDetails().getVatId());
            userDto.setBusinessDetails(businessDetailsDto);
        }

        return userDto;
    }

    private CharSequence generateDummyPassword() {
        return "NOPASS_" + System.currentTimeMillis();
    }

    @Override
    public boolean hasCustomerWithEmail(String email) {
        //return userRepo.findFirstByEmail(email).isPresent();
        log.info("hasCustomerWithEmail() - Prüfe, ob E-Mail existiert: {}", email);
        boolean exists = userRepo.findFirstByEmail(email).isPresent();
        log.info("hasCustomerWithEmail() - Existiert E-Mail {}: {}", email, exists);
        return exists;
    }


    private AddressDto convertAddressToDto(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto dto = new AddressDto();
        dto.setStreet(address.getStreet());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());
        return dto;
    }


}
