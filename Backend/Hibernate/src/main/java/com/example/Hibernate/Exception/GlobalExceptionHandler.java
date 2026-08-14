package com.example.Hibernate.Exception;

import com.example.Hibernate.DTO.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.validation.FieldError;
//import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)

    public ResponseEntity<ErrorResponse>

    handleValidation(

            MethodArgumentNotValidException ex,

            HttpServletRequest request){

        Map<String,String> errors=new HashMap<>();

        ex.getBindingResult()

                .getAllErrors()

                .forEach(error->{

                    String field=((FieldError) error).getField();

                    String message=error.getDefaultMessage();

                    errors.put(field,message);

                });

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                request.getRequestURI(),
                errors
        );

        return new ResponseEntity<>
                (response,HttpStatus.BAD_REQUEST);

    }

}