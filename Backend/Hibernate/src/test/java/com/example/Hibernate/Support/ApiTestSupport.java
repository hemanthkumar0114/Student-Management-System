package com.example.Hibernate.Support;

import com.example.Hibernate.DTO.LoginRequest;
import com.example.Hibernate.DTO.LoginResponse;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Model.User;
import com.example.Hibernate.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class ApiTestSupport {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected static String unique(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    protected User createTestUser(String username, String email, String rawPassword, Role role, boolean enabled) {
        User user = new User(username, email, passwordEncoder.encode(rawPassword), role);
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    protected String obtainToken(String usernameOrEmail, String password) {
        LoginRequest request = new LoginRequest(usernameOrEmail, password);
        LoginResponse response = restTemplate.postForObject("/auth/login", request, LoginResponse.class);
        return response != null ? response.getToken() : null;
    }

    protected HttpHeaders authHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return headers;
    }
}
