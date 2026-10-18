package com.krishione.notifications;

import com.krishione.auth.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class SmsNotificationService {

    private static final Logger log = LoggerFactory.getLogger(SmsNotificationService.class);

    private final NotificationLogRepository notificationLogRepository;

    public SmsNotificationService(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    @Transactional
    public void sendBookingConfirmation(User user,
                                        String bookingCode,
                                        String mandiName,
                                        String itemName,
                                        LocalDate slotDate,
                                        String startTime,
                                        String endTime) {
        String lang = (user != null && user.getPreferredLanguage() != null)
                ? user.getPreferredLanguage().toLowerCase()
                : "hi";

        String message;
        if ("en".equals(lang)) {
            message = String.format(
                    "Dear Farmer %s, your KrishiOne booking (%s) is CONFIRMED! Mandi: %s. Item: %s. Date: %s (%s to %s). Please show this token at the entry gate.",
                    user != null ? user.getName() : "Customer",
                    bookingCode,
                    mandiName,
                    itemName,
                    slotDate,
                    startTime,
                    endTime
            );
        } else {
            message = String.format(
                    "प्रिय किसान बंधु %s, कृषि-वन पोर्टल पर आपका टोकन क्रमांक [%s] सुरक्षित हो चुका है! मंडी: %s, सुविधा: %s, दिनांक: %s (समय: %s से %s)। मंडी गेट पर यह एसएमएस या डिजिटल पास दिखाएं।",
                    user != null ? user.getName() : "",
                    bookingCode,
                    mandiName,
                    itemName,
                    slotDate,
                    startTime,
                    endTime
            );
        }

        String phone = user != null ? user.getPhone() : "SYSTEM";
        log.info("[SIMULATED SMS GATEWAY] Dispatching to {}: {}", phone, message);

        NotificationLog logEntry = new NotificationLog(user, phone, message, "SMS", "DELIVERED");
        notificationLogRepository.save(logEntry);
    }
}
