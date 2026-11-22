package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.LoginRequest;
import com.example.Hibernate.DTO.LoginResponse;
import com.example.Hibernate.DTO.UserResponseDTO;
import com.example.Hibernate.Exception.AccountLockedException;
import com.example.Hibernate.Model.User;
import com.example.Hibernate.Repository.UserRepository;
import com.example.Hibernate.Security.JwtTokenProvider;
import com.example.Hibernate.Security.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final String DUMMY_HASH = "$2a$10$wK6nSg7zL8dY7dM5L5mRgeVpU6p7Cq4Z3L0V6m8QeG1V1Y2e5e1m2";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LoginAttemptService loginAttemptService;

    public LoginResponse login(LoginRequest loginRequest) {
        String identifier = loginRequest.getUsernameOrEmail();

        if (loginAttemptService.isLocked(identifier)) {
            throw new AccountLockedException("Too many failed login attempts. Please try again later.");
        }

        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(identifier, identifier);

        if (optionalUser.isEmpty()) {
            passwordEncoder.matches(loginRequest.getPassword() != null ? loginRequest.getPassword() : "", DUMMY_HASH);
            loginAttemptService.loginFailed(identifier);
            throw new BadCredentialsException("Invalid username/email or password");
        }

        User user = optionalUser.get();

        if (!user.isEnabled()) {
            throw new DisabledException("Account has been disabled. Please contact administrator.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            identifier,
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            loginAttemptService.loginSucceeded(identifier);
            loginAttemptService.loginSucceeded(user.getUsername());
            loginAttemptService.loginSucceeded(user.getEmail());

            String jwt = tokenProvider.generateToken(user);

            return new LoginResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.isEnabled());
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(identifier);
            loginAttemptService.loginFailed(user.getUsername());
            loginAttemptService.loginFailed(user.getEmail());
            throw new BadCredentialsException("Invalid username/email or password");
        }
    }

    public UserResponseDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return new UserResponseDTO(user);
    }
}
