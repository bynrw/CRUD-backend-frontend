package com.example.dto;

import com.example.entity.User;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    
    private Integer userId;
    private String username;
    private UUID userUid;
    private String firstName;
    private String lastName;
    private String mail;
    private String phone;
    private Integer wrongPassword;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .userUid(user.getUserUid())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mail(user.getMail())
                .phone(user.getPhone())
                .wrongPassword(user.getWrongPassword())
                .build();
    }
}
