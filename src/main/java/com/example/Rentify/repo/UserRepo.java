package com.example.Rentify.repo;

import com.example.Rentify.entity.User;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The UserRepo interface provides CRUD operations for the User entity
 */

@Repository
public interface UserRepo extends CrudRepository<User, Long> {
}
