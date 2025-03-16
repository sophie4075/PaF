package com.example.Rentify.service.instance;

import com.example.Rentify.dto.ArticleInstanceDto;

import java.util.List;

public interface ArticleInstanceService {

    void deleteInstance(Long articleId, Long instanceId);
    ArticleInstanceDto addInstance(Long articleId, ArticleInstanceDto instanceDto);
    ArticleInstanceDto updateInstance(Long articleId, Long instanceId, ArticleInstanceDto instanceDto);
    List<ArticleInstanceDto> getInstancesForArticle(Long articleId);
}

