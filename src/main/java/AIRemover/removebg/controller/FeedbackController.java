package AIRemover.removebg.controller;




import AIRemover.removebg.DTO.FeedbackDTO;
import AIRemover.removebg.Service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;


    @PostMapping
    public ResponseEntity<?> submitFeedback(
            @RequestBody FeedbackDTO dto,
            Authentication authentication
    ) {
        String clerkUserId = authentication.getName();
        return ResponseEntity.ok(
                feedbackService.submitFeedback(dto, clerkUserId)
        );
    }

    // 🌍 Public (or authenticated – your choice)
    @GetMapping
    public ResponseEntity<?> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}

