package com.example.Rentify.service.Storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

public interface StorageService {
    String saveImage(MultipartFile file) throws IOException;
    Resource loadImageAsResource(String fileName) throws MalformedURLException;
    String getContentType(String fileName) throws IOException;
    void deleteImage(String fileName) throws IOException;
}

