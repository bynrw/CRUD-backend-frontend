package com.example.service;

import com.example.dto.CreateUserRequest;
import com.example.dto.UpdateUserRequest;
import com.example.dto.UserDTO;
import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Erstelle einen neuen Benutzer
     */
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        // Prüfe auf Duplikate
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username existiert bereits!");
        }
        if (userRepository.findByMail(request.getMail()).isPresent()) {
            throw new IllegalArgumentException("Mail existiert bereits!");
        }

        // Erstelle neuen User
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .userUid(request.getUserUid())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .mail(request.getMail())
                .phone(request.getPhone())
                .wrongPassword(0)
                .build();

        User savedUser = userRepository.save(user);
        return UserDTO.fromEntity(savedUser);
    }

    /**
     * Hole einen Benutzer nach ID
     */
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        return UserDTO.fromEntity(user);
    }

    /**
     * Hole einen Benutzer nach Username
     */
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        return UserDTO.fromEntity(user);
    }

    /**
     * Alle Benutzer auflisten
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Nach Vorname suchen
     */
    public List<UserDTO> searchByFirstName(String firstName) {
        return userRepository.findByFirstNameContainingIgnoreCase(firstName)
                .stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Nach Nachname suchen
     */
    public List<UserDTO> searchByLastName(String lastName) {
        return userRepository.findByLastNameContainingIgnoreCase(lastName)
                .stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Benutzer aktualisieren
     */
    @Transactional
    public UserDTO updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));

        if (request.getMail() != null && !request.getMail().equals(user.getMail())) {
            if (userRepository.findByMail(request.getMail()).isPresent()) {
                throw new IllegalArgumentException("Mail existiert bereits!");
            }
            user.setMail(request.getMail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getUserUid() != null) {
            user.setUserUid(request.getUserUid());
        }

        User updatedUser = userRepository.save(user);
        return UserDTO.fromEntity(updatedUser);
    }

    /**
     * Benutzer löschen
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        
        userRepository.delete(user);
    }

    /**
     * Passwort ändern
     */
    @Transactional
    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setWrongPassword(0); // Reset wrong_password counter
        userRepository.save(user);
    }

    /**
     * Zähle falsche Passwort-Versuche
     */
    @Transactional
    public void incrementWrongPasswordCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        
        user.setWrongPassword(user.getWrongPassword() + 1);
        userRepository.save(user);
    }

    /**
     * Reset falsche Passwort-Versuche
     */
    @Transactional
    public void resetWrongPasswordCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden!"));
        
        user.setWrongPassword(0);
        userRepository.save(user);
    }
}
