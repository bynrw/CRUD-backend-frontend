package com.example.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {
    
    private String mail;
    private String firstName;
    private String lastName;
    private String phone;
    private UUID userUid;
}
