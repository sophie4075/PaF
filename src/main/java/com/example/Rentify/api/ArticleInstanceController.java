package com.example.Rentify.api;

import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.service.instance.ArticleInstanceServiceImpl;
import com.example.Rentify.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{articleId}/instances")
public class ArticleInstanceController {

    private final ArticleInstanceServiceImpl instanceService;

    public ArticleInstanceController(ArticleInstanceServiceImpl instanceService) {
        this.instanceService = instanceService;
    }

    @DeleteMapping("/{instanceId}")
    public ResponseEntity<Void> deleteInstance(@PathVariable Long articleId, @PathVariable Long instanceId) {
        return ResponseHandler.handleVoid(() -> instanceService.deleteInstance(articleId, instanceId));
    }

    @PostMapping
    public ResponseEntity<ArticleInstanceDto> addInstance(@PathVariable Long articleId,
                                                          @RequestBody ArticleInstanceDto instanceDto) {
        return ResponseHandler.handleWithStatus(() -> instanceService.addInstance(articleId, instanceDto), HttpStatus.CREATED);
    }

    @PutMapping("/{instanceId}")
    public ResponseEntity<ArticleInstanceDto> updateInstance(@PathVariable Long articleId,
                                                             @PathVariable Long instanceId,
                                                             @RequestBody ArticleInstanceDto instanceDto) {
        return ResponseHandler.handle(() -> instanceService.updateInstance(articleId, instanceId, instanceDto));
    }

    @GetMapping
    public ResponseEntity<List<ArticleInstanceDto>> getInstances(@PathVariable Long articleId) {
        return ResponseHandler.handle(() -> instanceService.getInstancesForArticle(articleId));
    }

}

