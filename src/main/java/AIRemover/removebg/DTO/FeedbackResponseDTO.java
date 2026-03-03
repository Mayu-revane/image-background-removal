package AIRemover.removebg.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponseDTO {
    private Long id;
    private String username;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String clerkUserId;
}
