package com.example.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Central error handling for all controllers.
 * Every error response has the same JSON shape:
 *   { "status": 400, "error_message": "...", "fieldErrors": ["field: message", ...] }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // @Valid failed on the request body
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        List<String> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getField)
                // @AssertTrue checks in DashboardDto are named "<field>Valid" -> report the real field name
                .map(f -> f.endsWith("Valid") ? f.substring(0, f.length() - "Valid".length()) : f)
                .distinct()
                .toList();
        Map<String, Object> body = errorBody(HttpStatus.BAD_REQUEST, "Validation failed for: " + String.join(", ", fieldErrors));
        body.put("fieldErrors", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    // Malformed JSON / wrong date format etc.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(errorBody(HttpStatus.BAD_REQUEST, "Malformed request body"));
    }

    // Bad input detected in our own code
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(errorBody(HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    // Anything unexpected: log the full stack trace, return a generic message
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception e) {
        // Spring's own web errors (404 unknown URL, 405 wrong method, ...) keep their status code
        if (e instanceof ErrorResponse errorResponse) {
            HttpStatusCode code = errorResponse.getStatusCode();
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("status", code.value());
            body.put("error_message", e.getMessage());
            return ResponseEntity.status(code).body(body);
        }
        log.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
    }

    private Map<String, Object> errorBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("error_message", message);
        return body;
    }
}
