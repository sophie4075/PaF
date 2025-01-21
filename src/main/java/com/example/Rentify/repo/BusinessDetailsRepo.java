package com.example.Rentify.repo;

import com.example.Rentify.entity.BusinessDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessDetailsRepo extends CrudRepository<BusinessDetails, Integer> {
    Optional<BusinessDetails> findFirstByCompanyNameAndVatId(String companyName, String vatId);
}
