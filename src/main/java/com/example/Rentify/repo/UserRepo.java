package com.example.Rentify.repo;

import com.example.Rentify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * The UserRepo interface provides CRUD operations for the User entity
 * using Spring Data JPA.
 */

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
   /**
    * Find a user by email and password.
    * @param email User's email.
    * @param password User's password.
    * @return The matching user.
    */
   User findByEmailAndPassword(String email, String password);

   /**
    * Find a user by their first and last name.
    * @param firstName User's first name.
    * @param lastName User's last name.
    * @return The matching user.
    */
   User findByFirstNameAndLastName(String firstName, String lastName);

   //extend fruther when needed
}
