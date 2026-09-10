package com.example.Hibernate.DTO;

import com.example.Hibernate.Model.Role;
import jakarta.validation.constraints.Email;

public class UserUpdateDTO {

    private String username;

    @Email(message = "Invalid email format")
    private String email;

    private Role role;

    private Boolean enabled;

    private String password;

    public UserUpdateDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
