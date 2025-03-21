package com.example.Rentify.configuration;

import com.example.Rentify.entity.Role;
import com.example.Rentify.service.jwt.UserService;
import jakarta.ws.rs.HttpMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecConfig {

    private final UserService userService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request

                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/articles/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/articles/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/articles/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/articles/*/instances/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/articles/*/instances/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/articles/*/instances/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/articles/*/instances/**").hasAuthority("ADMIN")


                        .requestMatchers(HttpMethod.POST, "/api/rental").hasAnyAuthority("PRIVATE_CLIENT", "BUSINESS_CLIENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rental/{id}").hasAuthority("ADMIN")
                        .requestMatchers("/api/rental/admin/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers("/api/rental/customer/**").hasAnyAuthority("PRIVATE_CLIENT", "BUSINESS_CLIENT")

                        .requestMatchers("/api/uploads/**").permitAll()


                        .requestMatchers("/api/categories/**", "/api/statuses/**").permitAll()
                        .anyRequest().authenticated()

                )
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService.userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /*.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                       .requestMatchers("/api/auth/**").permitAll()
                       .requestMatchers("/api/rental/**").permitAll()
                       .requestMatchers("/api/articles/**").permitAll()
                       .requestMatchers("/api/admin/**").hasAnyAuthority(Role.ADMIN.name())
                       .requestMatchers("/api/customer/**").hasAnyAuthority(Role.BUSINESS_CLIENT.name())
                       .requestMatchers("/api/customer/**").hasAnyAuthority(Role.PRIVATE_CLIENT.name())
                       .requestMatchers("api/rental/**").permitAll()
                       .requestMatchers("/api/articles/**").permitAll()
                       .requestMatchers("/api/uploads/**").permitAll()
                       .requestMatchers(
                               "/api/categories/**",
                               "/api/statuses/**").permitAll()
                       .anyRequest().authenticated()*/

}
