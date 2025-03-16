package com.example.Rentify.api;

import com.example.Rentify.service.storage.StorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


//Quellen:
// https://spring.io/guides/gs/uploading-files
// https://medium.com/@dulanjayasandaruwan1998/uploading-images-in-a-spring-boot-project-a-step-by-step-guide-8a55248ea520
@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:4200")
public class ImageUploadController {
    private final StorageServiceImpl storageServiceImpl;

    @Autowired
    public ImageUploadController(StorageServiceImpl storageServiceImpl) {
        this.storageServiceImpl = storageServiceImpl;
    }

    @PostMapping("/images")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = storageServiceImpl.saveImage(file);
            String fileDownloadUri = "http://localhost:8080/api/uploads/images/" + fileName;
            //return ResponseEntity.ok("Image uploaded successfully: " + fileDownloadUri);
            Map<String, String> response = new HashMap<>();
            response.put("fileDownloadUri", fileDownloadUri);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error uploading image"));
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Resource resource = storageServiceImpl.loadImageAsResource(filename);
            String contentType = storageServiceImpl.getContentType(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(contentType))
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
