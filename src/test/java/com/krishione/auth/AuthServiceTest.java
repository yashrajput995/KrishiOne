package com.krishione.auth;

import com.krishione.auth.dto.AuthResponse;
import com.krishione.auth.dto.LoginRequest;
import com.krishione.auth.dto.RegisterRequest;
import com.krishione.auth.security.JwtUtils;
import com.krishione.common.KrishiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("9876543210", "$2a$10$encoded", "Ramesh", Role.FARMER, "hi");
        sampleUser.setId(100L);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("9876543210", "pass123", "Ramesh", Role.FARMER, "hi");

        when(userRepository.existsByPhone("9876543210")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("$2a$10$encoded");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtUtils.generateToken("9876543210", 100L, "FARMER", "Ramesh")).thenReturn("mock-jwt-token");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("mock-jwt-token", res.getToken());
        assertEquals("9876543210", res.getPhone());
        assertEquals("Ramesh", res.getName());
    }

    @Test
    void testRegisterDuplicatePhoneThrowsException() {
        RegisterRequest req = new RegisterRequest("9876543210", "pass123", "Ramesh", Role.FARMER, "hi");
        when(userRepository.existsByPhone("9876543210")).thenReturn(true);

        assertThrows(KrishiException.class, () -> authService.register(req));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("9876543210", "pass123");

        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("pass123", "$2a$10$encoded")).thenReturn(true);
        when(jwtUtils.generateToken("9876543210", 100L, "FARMER", "Ramesh")).thenReturn("mock-jwt-token");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock-jwt-token", res.getToken());
    }

    @Test
    void testLoginInvalidPasswordThrowsException() {
        LoginRequest req = new LoginRequest("9876543210", "wrong-password");

        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrong-password", "$2a$10$encoded")).thenReturn(false);

        assertThrows(KrishiException.class, () -> authService.login(req));
    }
}
