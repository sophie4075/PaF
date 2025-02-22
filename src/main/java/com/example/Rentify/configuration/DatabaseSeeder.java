package com.example.Rentify.configuration;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.Category;
import com.example.Rentify.repo.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepo categoryRepository;
    private final ArticleRepo articleRepository;
    private final ArticleInstanceRepo articleInstanceRepository;

    public DatabaseSeeder(
                          CategoryRepo categoryRepository,
                          ArticleRepo articleRepository,
                          ArticleInstanceRepo articleInstanceRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.articleInstanceRepository = articleInstanceRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        articleInstanceRepository.deleteAll();
        articleRepository.deleteAll();
        categoryRepository.deleteAll();


        Map<String, List<Article>> categoryArticlesMap = new HashMap<>();

        categoryArticlesMap.put("Laptop", Arrays.asList(
                new Article("MacBook Pro", "Apple Laptop mit M2 Chip", 5, 2400.00, "https://picsum.photos/200"),
                new Article("Dell XPS 15", "Leistungsstark und portabel", 3, 1800.00, "https://picsum.photos/200")
        ));

        categoryArticlesMap.put("Kamera", Arrays.asList(
                new Article("Canon EOS R5", "High-End Vollformat Kamera", 2, 3900.00, "https://picsum.photos/200"),
                new Article("Sony Alpha A7 III", "Spiegellose Systemkamera", 4, 2000.00, "https://picsum.photos/200")
        ));

        categoryArticlesMap.put("Werkzeug", Arrays.asList(
                new Article("Bosch Akkuschrauber", "18V Akkuschrauber-Set", 10, 199.00, "https://picsum.photos/200"),
                new Article("Makita Bohrmaschine", "Robuste Schlagbohrmaschine", 6, 150.00, "https://picsum.photos/200")
        ));

        categoryArticlesMap.put("Tontechnik", Arrays.asList(
                new Article("Shure SM7B Mikrofon", "Professionelles Studio-Mikrofon", 5, 399.00, "https://picsum.photos/200"),
                new Article("Yamaha Mischpult", "16-Kanal Analog-Mixer", 2, 499.00, "https://picsum.photos/200")
        ));

        for (Map.Entry<String, List<Article>> entry : categoryArticlesMap.entrySet()) {
            Category category = new Category();
            category.setName(entry.getKey());
            category = categoryRepository.save(category);

            for (Article article : entry.getValue()) {
                article.setCategory(category);
                articleRepository.save(article);
            }
        }

        System.out.println("Added articles to database.");

    }
}
