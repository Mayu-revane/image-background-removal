package AIRemover.removebg.repository;


import AIRemover.removebg.entity.FeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Long> {

    // prevent duplicate feedback per user
    Optional<FeedbackEntity> findByClerkUserId(String clerkUserId);
}