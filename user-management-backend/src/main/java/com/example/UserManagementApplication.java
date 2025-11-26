package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserManagementApplication.class, args);
        System.out.println("✓ User Management Backend gestartet");
        System.out.println("✓ Verbunden mit: jdbc:postgresql://localhost:5432/postgres");
        System.out.println("✓ Tabelle: ua_user");
    }
}
