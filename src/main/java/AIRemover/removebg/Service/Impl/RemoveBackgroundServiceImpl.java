package AIRemover.removebg.Service.Impl;

import AIRemover.removebg.Service.RemoveBackgroundService;
import AIRemover.removebg.client.ClipdropClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;




@Service
@RequiredArgsConstructor
public class RemoveBackgroundServiceImpl implements RemoveBackgroundService {

    @Value("${clipdrop.apikey}")
    private String apiKey;

    private final ClipdropClient clipdropClient;


    @Override
    public byte[] removeBackground(MultipartFile file) {
        return clipdropClient.removeBackground(file,apiKey);


    }
}
