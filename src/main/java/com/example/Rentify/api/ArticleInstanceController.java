package com.example.Rentify.api;

import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.service.instance.ArticleInstanceServiceImpl;
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
        instanceService.deleteInstance(articleId, instanceId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ArticleInstanceDto> addInstance(@PathVariable Long articleId,
                                                          @RequestBody ArticleInstanceDto instanceDto) {
        ArticleInstanceDto created = instanceService.addInstance(articleId, instanceDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{instanceId}")
    public ResponseEntity<ArticleInstanceDto> updateInstance(@PathVariable Long articleId,
                                                             @PathVariable Long instanceId,
                                                             @RequestBody ArticleInstanceDto instanceDto) {
        ArticleInstanceDto updated = instanceService.updateInstance(articleId, instanceId, instanceDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<ArticleInstanceDto>> getInstances(@PathVariable Long articleId) {
        List<ArticleInstanceDto> dtos = instanceService.getInstancesForArticle(articleId);
        return ResponseEntity.ok(dtos);
    }

}

