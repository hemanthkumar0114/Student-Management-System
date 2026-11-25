package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.UserCreateDTO;
import com.example.Hibernate.DTO.UserResponseDTO;
import com.example.Hibernate.DTO.UserUpdateDTO;
import com.example.Hibernate.Exception.AdminSafetyException;
import com.example.Hibernate.Exception.ResourceNotFoundException;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Model.User;
import com.example.Hibernate.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserResponseDTO(user);
    }

    public UserResponseDTO createUser(UserCreateDTO dto) {
        String trimmedUsername = dto.getUsername() != null ? dto.getUsername().trim() : null;
        String normalizedEmail = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : null;

        if (userRepository.existsByUsername(trimmedUsername)) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String rawPassword = dto.getPassword() != null ? dto.getPassword().trim() : "";
        if (rawPassword.length() < 8 || rawPassword.length() > 72) {
            throw new IllegalArgumentException("Password must be between 8 and 72 characters");
        }

        User user = new User();
        user.setUsername(trimmedUsername);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(dto.getRole());
        user.setEnabled(true);

        User saved = userRepository.save(user);
        return new UserResponseDTO(saved);
    }

    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        return updateUser(id, dto, null);
    }

    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto, String currentAdminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String currentAdmin = resolveCurrentAdmin(currentAdminUsername);
        boolean isSelf = currentAdmin != null && (currentAdmin.equalsIgnoreCase(user.getUsername()) || currentAdmin.equalsIgnoreCase(user.getEmail()));

        if (dto.getEnabled() != null && !dto.getEnabled() && user.isEnabled()) {
            if (isSelf) {
                throw new AdminSafetyException("Administrators cannot disable their own account");
            }
            if (user.getRole() == Role.ADMIN && (userRepository.countByRole(Role.ADMIN) <= 1 || userRepository.countByRoleAndEnabled(Role.ADMIN, true) <= 1)) {
                throw new AdminSafetyException("Cannot disable the last remaining administrator account");
            }
        }

        if (dto.getRole() != null && dto.getRole() != Role.ADMIN && user.getRole() == Role.ADMIN) {
            if (userRepository.countByRole(Role.ADMIN) <= 1 || (user.isEnabled() && userRepository.countByRoleAndEnabled(Role.ADMIN, true) <= 1)) {
                throw new AdminSafetyException("Cannot demote the last remaining administrator account");
            }
            if (isSelf) {
                throw new AdminSafetyException("Administrators cannot demote their own account");
            }
        }

        if (dto.getUsername() != null && !dto.getUsername().trim().isEmpty()) {
            String trimmedUsername = dto.getUsername().trim();
            if (!trimmedUsername.equals(user.getUsername())) {
                if (userRepository.existsByUsername(trimmedUsername)) {
                    throw new IllegalArgumentException("Username is already taken");
                }
                user.setUsername(trimmedUsername);
            }
        }

        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            String normalizedEmail = dto.getEmail().trim().toLowerCase();
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                    throw new IllegalArgumentException("Email is already registered");
                }
                user.setEmail(normalizedEmail);
            }
        }

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        if (dto.getEnabled() != null) {
            user.setEnabled(dto.getEnabled());
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            String rawPassword = dto.getPassword().trim();
            if (rawPassword.length() < 8 || rawPassword.length() > 72) {
                throw new IllegalArgumentException("Password must be between 8 and 72 characters");
            }
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        User updated = userRepository.save(user);
        return new UserResponseDTO(updated);
    }

    public void deleteUser(Long id) {
        deleteUser(id, null);
    }

    public void deleteUser(Long id, String currentAdminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String currentAdmin = resolveCurrentAdmin(currentAdminUsername);
        boolean isSelf = currentAdmin != null && (currentAdmin.equalsIgnoreCase(user.getUsername()) || currentAdmin.equalsIgnoreCase(user.getEmail()));

        if (isSelf) {
            throw new AdminSafetyException("Administrators cannot delete their own account");
        }

        if (user.getRole() == Role.ADMIN && (userRepository.countByRole(Role.ADMIN) <= 1 || (user.isEnabled() && userRepository.countByRoleAndEnabled(Role.ADMIN, true) <= 1))) {
            throw new AdminSafetyException("Cannot delete the last remaining administrator account");
        }

        userRepository.delete(user);
    }

    public UserResponseDTO toggleUserStatus(Long id) {
        return toggleUserStatus(id, null);
    }

    public UserResponseDTO toggleUserStatus(Long id, String currentAdminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String currentAdmin = resolveCurrentAdmin(currentAdminUsername);
        boolean isSelf = currentAdmin != null && (currentAdmin.equalsIgnoreCase(user.getUsername()) || currentAdmin.equalsIgnoreCase(user.getEmail()));

        if (user.isEnabled()) {
            if (isSelf) {
                throw new AdminSafetyException("Administrators cannot disable their own account");
            }
            if (user.getRole() == Role.ADMIN && (userRepository.countByRole(Role.ADMIN) <= 1 || userRepository.countByRoleAndEnabled(Role.ADMIN, true) <= 1)) {
                throw new AdminSafetyException("Cannot disable the last remaining administrator account");
            }
        }

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        return new UserResponseDTO(saved);
    }

    private String resolveCurrentAdmin(String explicitAdminUsername) {
        if (explicitAdminUsername != null && !explicitAdminUsername.trim().isEmpty()) {
            return explicitAdminUsername.trim();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null && !auth.getName().trim().isEmpty()) {
            return auth.getName().trim();
        }
        return null;
    }
}
