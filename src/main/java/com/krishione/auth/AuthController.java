package com.krishione.auth;

import com.krishione.auth.dto.AuthResponse;
import com.krishione.auth.dto.LoginRequest;
import com.krishione.auth.dto.RegisterRequest;
import com.krishione.auth.security.JwtUtils;
import com.krishione.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtils.getUserIdFromToken(token);
        User user = authService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/language")
    public ResponseEntity<ApiResponse<User>> updateLanguage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody java.util.Map<String, String> body) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtils.getUserIdFromToken(token);
        String lang = body.getOrDefault("language", "hi");
        User user = authService.updateLanguage(userId, lang);
        return ResponseEntity.ok(ApiResponse.ok("Language updated", user));
    }
}
