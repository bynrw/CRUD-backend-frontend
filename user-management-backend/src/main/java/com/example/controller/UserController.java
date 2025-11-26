package com.example.controller;

import com.example.dto.CreateUserRequest;
import com.example.dto.UpdateUserRequest;
import com.example.dto.UserDTO;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Hole alle Benutzer
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Hole einen Benutzer nach ID
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        try {
            UserDTO user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Hole einen Benutzer nach Username
     * GET /api/users/username/{username}
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Suche nach Vorname
     * GET /api/users/search/firstname/{firstName}
     */
    @GetMapping("/search/firstname/{firstName}")
    public ResponseEntity<List<UserDTO>> searchByFirstName(@PathVariable String firstName) {
        List<UserDTO> users = userService.searchByFirstName(firstName);
        return ResponseEntity.ok(users);
    }

    /**
     * Suche nach Nachname
     * GET /api/users/search/lastname/{lastName}
     */
    @GetMapping("/search/lastname/{lastName}")
    public ResponseEntity<List<UserDTO>> searchByLastName(@PathVariable String lastName) {
        List<UserDTO> users = userService.searchByLastName(lastName);
        return ResponseEntity.ok(users);
    }

    /**
     * Erstelle einen neuen Benutzer
     * POST /api/users
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
        try {
            UserDTO createdUser = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Aktualisiere einen Benutzer
     * PUT /api/users/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        try {
            UserDTO updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lösche einen Benutzer
     * DELETE /api/users/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Ändere das Passwort eines Benutzers
     * POST /api/users/{userId}/change-password
     */
    @PostMapping("/{userId}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            userService.changePassword(userId, newPassword);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Inkrementiere falsche Passwort-Versuche
     * POST /api/users/{userId}/wrong-password
     */
    @PostMapping("/{userId}/wrong-password")
    public ResponseEntity<Void> incrementWrongPassword(@PathVariable Long userId) {
        try {
            userService.incrementWrongPasswordCount(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Reset falsche Passwort-Versuche
     * POST /api/users/{userId}/reset-wrong-password
     */
    @PostMapping("/{userId}/reset-wrong-password")
    public ResponseEntity<Void> resetWrongPassword(@PathVariable Long userId) {
        try {
            userService.resetWrongPasswordCount(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
