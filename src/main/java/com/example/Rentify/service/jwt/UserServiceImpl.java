package com.example.Rentify.service.jwt;

import com.example.Rentify.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("jwtUserServiceImpl")
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
   private final UserRepo userRepository;

   @Override
    public UserDetailsService userDetailsService() {
       return username -> userRepository.findFirstByEmail(username)
               .orElseThrow(() -> new UsernameNotFoundException("An error occurred while trying to load the user " + username + ". " +
                       "Please contact the support if this error reoccurs"));
   }
}
