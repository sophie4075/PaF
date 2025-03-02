package com.example.Rentify.configuration;

import com.example.Rentify.entity.Article;
import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.Category;
import com.example.Rentify.entity.Status;
import com.example.Rentify.repo.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

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


        Map<String, Map<String, List<Article>>> categoryMap = new HashMap<>();

        Map<String, List<Article>> laptopSubcategories = new HashMap<>();
        laptopSubcategories.put("Apple", List.of(
                new Article("MacBook Pro", "Apple Laptop mit M2 Chip", 5, 2400.00, "https://picsum.photos/200")
        ));
        laptopSubcategories.put("Dell", List.of(
                new Article("Dell XPS 15", "Leistungsstark und portabel", 3, 1800.00, "https://picsum.photos/200")
        ));
        categoryMap.put("Laptop", laptopSubcategories);

        Map<String, List<Article>> werkzeugSubcategories = new HashMap<>();
        werkzeugSubcategories.put("Schraubenzieher", List.of(
                new Article("Bosch Akkuschrauber", "18V Akkuschrauber-Set", 10, 199.00, "https://picsum.photos/200")
        ));
        werkzeugSubcategories.put("Bohrmaschinen", List.of(
                new Article("Makita Bohrmaschine", "Robuste Schlagbohrmaschine", 6, 150.00, "https://picsum.photos/200")
        ));
        categoryMap.put("Werkzeug", werkzeugSubcategories);

        for (Map.Entry<String, Map<String, List<Article>>> mainEntry : categoryMap.entrySet()) {
            // Create Category
            Category mainCategory = new Category();
            mainCategory.setName(mainEntry.getKey());
            mainCategory = categoryRepository.save(mainCategory);

            // Run through all sub categories of the main category
            Map<String, List<Article>> subMap = mainEntry.getValue();
            for (Map.Entry<String, List<Article>> subEntry : subMap.entrySet()) {
                // Create subcategory and assign parent category
                Category subCategory = new Category();
                subCategory.setName(subEntry.getKey());
                subCategory.setParent(mainCategory);
                subCategory = categoryRepository.save(subCategory);

                // Add article to subcategory
                for (Article article : subEntry.getValue()) {
                    Set<Category> categories = new HashSet<>();
                    categories.add(subCategory);
                    article.setCategories(categories);

                    Article savedArticle = articleRepository.save(article);
                    for (int i = 1; i <= savedArticle.getStueckzahl(); i++) {
                        ArticleInstance instance = new ArticleInstance();
                        instance.setArticle(savedArticle);
                        instance.setStatus(Status.AVAILABLE);
                        instance.setInventoryNumber("ART-" + savedArticle.getId() + "-" + i);
                        articleInstanceRepository.save(instance);
                    }
                }

            }
        }


        System.out.println("Added articles to database.");

    }
}
