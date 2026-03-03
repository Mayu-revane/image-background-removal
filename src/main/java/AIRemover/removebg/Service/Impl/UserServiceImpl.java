package AIRemover.removebg.Service.Impl;

import AIRemover.removebg.DTO.UserDTO;
import AIRemover.removebg.Service.UserService;
import AIRemover.removebg.entity.UserEntity;
import AIRemover.removebg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        Optional<UserEntity> optionalUser = userRepository.findByClerkId(userDTO.getClerkId());

        UserEntity userEntity;

        if (optionalUser.isPresent()) {
            userEntity = optionalUser.get();
            // Update fields
            if (userDTO.getEmail() != null) userEntity.setEmail(userDTO.getEmail());
            if (userDTO.getFirstName() != null) userEntity.setFirstName(userDTO.getFirstName());
            if (userDTO.getLastName() != null) userEntity.setLastName(userDTO.getLastName());
            if (userDTO.getPhotoUrl() != null) userEntity.setPhotoUrl(userDTO.getPhotoUrl());
          //  if (userDTO.getCredits() != null) userEntity.setCredits(userDTO.getCredits());
        } else {
            // Create new user
            userEntity = UserEntity.builder()
                    .clerkId(userDTO.getClerkId())
                    .email(userDTO.getEmail() != null ? userDTO.getEmail() : "")
                    .firstName(userDTO.getFirstName() != null ? userDTO.getFirstName() : "")
                    .lastName(userDTO.getLastName() != null ? userDTO.getLastName() : "")
                    .photoUrl(userDTO.getPhotoUrl() != null ? userDTO.getPhotoUrl() : "")
             //       .credits(userDTO.getCredits() != null ? userDTO.getCredits() : 5)
                    .build();
        }

        userRepository.save(userEntity);
        return mapToDTO(userEntity);
    }

    @Override
    public UserDTO getUserByClerkId(String clerkId) {
        UserEntity userEntity = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapToDTO(userEntity);
    }

    @Override
    public void deleteUserByClerkId(String clerkId) {
        UserEntity userEntity = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepository.delete(userEntity);
    }

    @Override
    public String getUserNameByClerkId(String clerkId) {
        UserEntity user = userRepository.findByClerkId(clerkId).orElse(null);
        if (user != null) {
            String first = user.getFirstName() != null ? user.getFirstName() : "";
            String last = user.getLastName() != null ? user.getLastName() : "";
            return (first + " " + last).trim().isEmpty() ? "Anonymous" : first + " " + last;
        }
        return "Anonymous";
    }


    private UserDTO mapToDTO(UserEntity userEntity) {
        return UserDTO.builder()
                .clerkId(userEntity.getClerkId())
           //     .credits(userEntity.getCredits())
                .email(userEntity.getEmail())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .photoUrl(userEntity.getPhotoUrl())
                .build();
    }
}
