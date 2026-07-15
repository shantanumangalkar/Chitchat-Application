package org.project.realtimechatapplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@org.springframework.scheduling.annotation.EnableScheduling
@SpringBootApplication
public class RealTimeChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealTimeChatApplication.class, args);
    }

}
