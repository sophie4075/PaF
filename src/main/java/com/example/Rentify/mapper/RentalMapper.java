package com.example.Rentify.mapper;

import com.example.Rentify.dto.RentalDto;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.dto.RentalPositionDto;
import com.example.Rentify.entity.Rental;
import com.example.Rentify.entity.RentalPosition;

import java.util.List;
import java.util.stream.Collectors;

public class RentalMapper {

    public static RentalDto toDTO(Rental rental, List<RentalPosition> rentalPositions) {
        RentalDto dto = new RentalDto();
        dto.setId(rental.getId());
        dto.setRentalStatus(rental.getRentalStatus().name());
        dto.setTotalPrice(rental.getTotalPrice());

        UserDto userDto = new UserDto();
        if (rental.getUser() != null) {
            userDto.setId(rental.getUser().getId());
            userDto.setEmail(rental.getUser().getEmail());
            userDto.setFirstName(rental.getUser().getFirstName());
            userDto.setLastName(rental.getUser().getLastName());
        }
        dto.setUser(userDto);

        // Mapping der RentalPositionen aus der separaten Liste
        List<RentalPositionDto> positions = rentalPositions.stream().map(pos -> {
            RentalPositionDto posDto = new RentalPositionDto();
            posDto.setId(pos.getId());
            posDto.setRentalStart(pos.getRentalStart());
            posDto.setRentalEnd(pos.getRentalEnd());
            posDto.setPositionPrice(pos.getPositionPrice());
            posDto.setArticleInstanceId(pos.getArticleInstance().getId());
            return posDto;
        }).collect(Collectors.toList());

        dto.setRentalPositions(positions);

        return dto;
    }
}

