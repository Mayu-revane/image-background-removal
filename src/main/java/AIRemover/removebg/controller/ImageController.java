package AIRemover.removebg.controller;

import AIRemover.removebg.Service.RemoveBackgroundService;
import AIRemover.removebg.Service.UserService;
import AIRemover.removebg.response.RemoveBgResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Base64;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final RemoveBackgroundService removeBackgroundService;
    private final UserService userService;

    public ImageController(RemoveBackgroundService removeBackgroundService, UserService userService) {
        this.removeBackgroundService = removeBackgroundService;
        this.userService = userService;
    }

    @PostMapping("/remove-background")
    public ResponseEntity<?> removeBackground(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            // ✅ Optional: Authentication check (keep or remove as per your requirement)
            if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
                return new ResponseEntity<>(
                        RemoveBgResponse.builder()
                                .statusCode(HttpStatus.FORBIDDEN)
                                .success(false)
                                .data("User does not have permission/access to this resource")
                                .build(),
                        HttpStatus.FORBIDDEN
                );
            }

            System.out.println("Authenticated user: " + authentication.getName());
            System.out.println("Received file: " + file.getOriginalFilename());

            // ✅ File validation
            if (file.isEmpty()) {
                return new ResponseEntity<>(
                        RemoveBgResponse.builder()
                                .statusCode(HttpStatus.BAD_REQUEST)
                                .success(false)
                                .data("Uploaded file is empty")
                                .build(),
                        HttpStatus.BAD_REQUEST
                );
            }

            // ✅ Background removal (NO CREDIT LOGIC)
            byte[] imageBytes = removeBackgroundService.removeBackground(file);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            System.out.println("Background removed successfully (FREE)");

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                    .body(base64Image);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    RemoveBgResponse.builder()
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                            .success(false)
                            .data("Internal error occurred")
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
