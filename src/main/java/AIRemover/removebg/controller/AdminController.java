package AIRemover.removebg.controller;

import AIRemover.removebg.Security.JwtUtil;
import AIRemover.removebg.entity.AdminEntity;
import AIRemover.removebg.entity.UserEntity;
import AIRemover.removebg.repository.AdminRepository;
import AIRemover.removebg.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;


import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminSignupRequest request) {

        AdminEntity admin = AdminEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        adminRepository.save(admin);
        System.out.println("Login attempt for: " + request.getEmail());
        return ResponseEntity.ok("Admin created");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        System.out.println("ADMIN LOGIN HIT: " + request.getEmail());

        AdminEntity admin = adminRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (admin == null) {
            return ResponseEntity.status(401).body("Admin not found");
        }

        System.out.println("DB password = " + admin.getPassword());
        System.out.println("Match = " + passwordEncoder.matches(request.getPassword(), admin.getPassword()));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }


        String token = jwtUtil.generateToken(admin.getEmail());

        return ResponseEntity.ok(token);
    }



    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }


    @Data
    public static class AdminSignupRequest {
        private String email;
        private String password;
    }

    @Data
    public static class AdminLoginRequest {
        private String email;
        private String password;
    }
}