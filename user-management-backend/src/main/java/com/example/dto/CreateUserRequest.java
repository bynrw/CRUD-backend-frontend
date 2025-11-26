package com.example.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {
    
    private String username;
    private String password;
    @Builder.Default
    private UUID userUid = UUID.randomUUID();
    private String firstName;
    private String lastName;
    private String mail;
    private String phone;
}
