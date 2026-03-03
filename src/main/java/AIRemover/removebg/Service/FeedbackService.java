package AIRemover.removebg.Service;

import AIRemover.removebg.DTO.FeedbackDTO;
import AIRemover.removebg.DTO.FeedbackResponseDTO;  // ✅ ADD THIS IMPORT
import AIRemover.removebg.entity.FeedbackEntity;
import java.util.List;

public interface FeedbackService {
    FeedbackEntity submitFeedback(FeedbackDTO dto, String clerkUserId);
    List<FeedbackResponseDTO> getAllFeedback();
}
