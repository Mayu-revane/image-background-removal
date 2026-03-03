package AIRemover.removebg.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_admins")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role = "ADMIN"; // default role
}