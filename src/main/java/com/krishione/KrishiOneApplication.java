package com.krishione;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class KrishiOneApplication {

    public static void main(String[] args) {
        SpringApplication.run(KrishiOneApplication.class, args);
    }
}
