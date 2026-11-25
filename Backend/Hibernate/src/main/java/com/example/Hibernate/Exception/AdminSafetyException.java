package com.example.Hibernate.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AdminSafetyException extends RuntimeException {
    public AdminSafetyException(String message) {
        super(message);
    }
}
