package com.example.Hibernate.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    @Value("${app.security.lockout.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.lockout.duration-minutes:15}")
    private int lockoutDurationMinutes;

    private static class Attempt {
        int failedAttempts;
        Instant lockoutExpiry;

        Attempt(int failedAttempts) {
            this.failedAttempts = failedAttempts;
            this.lockoutExpiry = null;
        }
    }

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public boolean isLocked(String usernameOrEmail) {
        if (usernameOrEmail == null) {
            return false;
        }
        String key = usernameOrEmail.trim().toLowerCase();
        Attempt attempt = attempts.get(key);
        if (attempt == null) {
            return false;
        }
        if (attempt.lockoutExpiry != null) {
            if (Instant.now().isBefore(attempt.lockoutExpiry)) {
                return true;
            } else {
                attempts.remove(key);
                return false;
            }
        }
        return false;
    }

    public void loginFailed(String usernameOrEmail) {
        if (usernameOrEmail == null) {
            return;
        }
        String key = usernameOrEmail.trim().toLowerCase();
        attempts.compute(key, (k, attempt) -> {
            if (attempt == null) {
                return new Attempt(1);
            }
            if (attempt.lockoutExpiry != null && Instant.now().isAfter(attempt.lockoutExpiry)) {
                return new Attempt(1);
            }
            attempt.failedAttempts++;
            if (attempt.failedAttempts >= maxAttempts) {
                attempt.lockoutExpiry = Instant.now().plusSeconds(lockoutDurationMinutes * 60L);
            }
            return attempt;
        });
    }

    public void loginSucceeded(String usernameOrEmail) {
        if (usernameOrEmail != null) {
            attempts.remove(usernameOrEmail.trim().toLowerCase());
        }
    }

    public void reset() {
        attempts.clear();
    }
}
