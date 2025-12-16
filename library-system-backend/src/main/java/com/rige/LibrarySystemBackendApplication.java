package com.rige;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LibrarySystemBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibrarySystemBackendApplication.class, args);
    }

}
