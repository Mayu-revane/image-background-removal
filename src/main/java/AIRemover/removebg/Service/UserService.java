package AIRemover.removebg.Service;

import AIRemover.removebg.DTO.UserDTO;

public interface UserService {

    UserDTO saveUser(UserDTO userDTO);

    UserDTO getUserByClerkId(String clerkId);

    void deleteUserByClerkId(String clerkId);

    String getUserNameByClerkId(String clerkId);


}
