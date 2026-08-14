package com.example.Hibernate.DTO;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {

    private LocalDateTime timestamp;
    private Integer status;
    private String message;
    private String path;
    private Map<String,String> errors;
    public ErrorResponse(){

    }

    public ErrorResponse(LocalDateTime timestamp,
                         Integer status,
                         String message,
                         String path,
                         Map<String, String> errors){
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.path = path;
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Integer getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }
}
