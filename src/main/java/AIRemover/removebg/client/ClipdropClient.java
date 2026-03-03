package AIRemover.removebg.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@FeignClient(name = "clipdropClient" , url = "https://clipdrop-api.co")
public interface ClipdropClient {

    @PostMapping(value = "/remove-background/v1" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    byte[] removeBackground(@RequestPart("image_file")MultipartFile file,
                            @RequestHeader("x-api-key") String apikey);
}
