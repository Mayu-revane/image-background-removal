package AIRemover.removebg.Service.Impl;

import AIRemover.removebg.DTO.FeedbackDTO;
import AIRemover.removebg.DTO.FeedbackResponseDTO;
import AIRemover.removebg.Service.FeedbackService;
import AIRemover.removebg.Service.UserService;  // ✅ ADD THIS
import AIRemover.removebg.entity.FeedbackEntity;
import AIRemover.removebg.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserService userService;  // ✅ INJECT UserService

    @Override
    public FeedbackEntity submitFeedback(FeedbackDTO dto, String clerkUserId) {
        feedbackRepository.findByClerkUserId(clerkUserId)
                .ifPresent(f -> {
                    throw new RuntimeException("Feedback already submitted");
                });

        FeedbackEntity feedback = FeedbackEntity.builder()
                .clerkUserId(clerkUserId)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<FeedbackResponseDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(feedback -> FeedbackResponseDTO.builder()
                        .id(feedback.getId())
                        .username(userService.getUserNameByClerkId(feedback.getClerkUserId()))  // ✅ REAL USERNAME
                        .rating(feedback.getRating())
                        .comment(feedback.getComment())
                        .createdAt(feedback.getCreatedAt())
                        .clerkUserId(feedback.getClerkUserId())
                        .build()
                )
                .collect(Collectors.toList());
    }
}
