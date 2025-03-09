package com.example.Rentify.service.instance;

import com.example.Rentify.dto.ArticleInstanceDto;
import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.Status;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.ArticleRepo;
import com.example.Rentify.mapper.ArticleMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleInstanceServiceImpl {
    private final ArticleRepo articleRepo;
    private final ArticleInstanceRepo instanceRepo;


    public ArticleInstanceServiceImpl(ArticleRepo articleRepo, ArticleInstanceRepo instanceRepo) {
        this.articleRepo = articleRepo;
        this.instanceRepo = instanceRepo;
    }

    public void deleteInstance(Long articleId, Long instanceId) {
        Article article = articleRepo.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));
        ArticleInstance instance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new IllegalArgumentException("Instance not found"));

        if (instance.getStatus() != Status.RETIRED) {
            throw new IllegalArgumentException("Nur Instanzen mit Status RETIRED dürfen gelöscht werden.");
        }
        instanceRepo.delete(instance);
        updateArticleQuantity(article);
    }

    public ArticleInstanceDto addInstance(Long articleId, ArticleInstanceDto instanceDto) {
        Article article = articleRepo.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));
        ArticleInstance newInstance = new ArticleInstance();
        newInstance.setArticle(article);
        newInstance.setStatus(Status.valueOf(instanceDto.getStatus().toUpperCase()));

        List<ArticleInstance> currentInstances = instanceRepo.findByArticle(article);
        int maxCounter = currentInstances.stream()
                .map(inst -> {
                    String[] parts = inst.getInventoryNumber().split("-");
                    try {
                        return Integer.parseInt(parts[2]);
                    } catch (Exception e) {
                        return 0;
                    }
                })
                .max(Integer::compare)
                .orElse(0);
        newInstance.setInventoryNumber("ART-" + article.getId() + "-" + (maxCounter + 1));
        instanceRepo.save(newInstance);
        updateArticleQuantity(article);
        return ArticleMapper.toInstanceDto(newInstance);
    }

    public ArticleInstanceDto updateInstance(Long articleId, Long instanceId, ArticleInstanceDto instanceDto) {
        ArticleInstance instance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new IllegalArgumentException("Instance not found"));
        if (instance.getStatus() == Status.RENTED) {
            throw new IllegalArgumentException("Instanz mit Status RENTED darf nicht geändert werden.");
        }
        instance.setStatus(Status.valueOf(instanceDto.getStatus().toUpperCase()));
        instanceRepo.save(instance);
        return ArticleMapper.toInstanceDto(instance);
    }

    private void updateArticleQuantity(Article article) {
        int count = instanceRepo.findByArticle(article).size();
        article.setStueckzahl(count);
        articleRepo.save(article);
    }

    public List<ArticleInstanceDto> getInstancesForArticle(Long articleId) {
        Article article = articleRepo.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));
        List<ArticleInstance> instances = instanceRepo.findByArticle(article);
        return instances.stream()
                .map(ArticleMapper::toInstanceDto)
                .collect(Collectors.toList());
    }
}
