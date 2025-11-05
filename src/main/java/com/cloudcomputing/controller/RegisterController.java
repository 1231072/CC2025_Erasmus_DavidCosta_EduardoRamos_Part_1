
package com.cloudcomputing.controller;

import com.cloudcomputing.model.UserEntity;
import com.cloudcomputing.service.JpaUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final JpaUserDetailsService userService;

    public RegisterController(JpaUserDetailsService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (req.getUsername() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("username and password required");
        }
        try {
            UserEntity created = userService.register(req.getUsername(), req.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body("user created: " + created.getUsername());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}