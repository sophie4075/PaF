package com.example.Rentify.api;

import com.example.Rentify.entity.Status;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statuses")
public class StatusController {
    @GetMapping
    public Status[] getStatuses() {
        return Status.values();
    }
}
