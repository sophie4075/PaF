package com.example.Rentify.configuration;

import com.example.Rentify.entity.*;
import com.example.Rentify.repo.*;
import com.example.Rentify.service.Rental.RentalServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepo categoryRepository;
    private final ArticleRepo articleRepository;
    private final ArticleInstanceRepo articleInstanceRepository;
    private final UserRepo userRepository;
    private final RentalRepo rentalRepository;
    private final RentalPositionRepo rentalPositionRepository;
    private final PasswordEncoder passwordEncoder;
    private final RentalServiceImpl rentalServiceImpl;


    public DatabaseSeeder(
            CategoryRepo categoryRepository,
            ArticleRepo articleRepository,
            ArticleInstanceRepo articleInstanceRepository,
            UserRepo userRepository,
            RentalRepo rentalRepository,
            RentalPositionRepo rentalPositionRepository,
            PasswordEncoder passwordEncoder,
            RentalServiceImpl rentalServiceImpl) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
        this.articleInstanceRepository = articleInstanceRepository;
        this.userRepository = userRepository;
        this.rentalRepository = rentalRepository;
        this.rentalPositionRepository = rentalPositionRepository;
        this.passwordEncoder = passwordEncoder;
        this.rentalServiceImpl = rentalServiceImpl;
    }


    @Override
    public void run(String... args) throws Exception {
        rentalPositionRepository.deleteAll();
        rentalRepository.deleteAll();
        articleInstanceRepository.deleteAll();
        articleRepository.deleteAll();
        categoryRepository.deleteAll();
        //userRepository.deleteAll();

        seedUsers();
        seedArticles();
        seedRentals();
        System.out.println("Database seeding completed.");
    }

    private void seedUsers() {
        Optional<User> existingUser1 = userRepository.findFirstByEmail("max@mustermann.com");
        Optional<User> existingUser2 = userRepository.findFirstByEmail("erika@musterfrau.com");

        if (existingUser1.isEmpty() || existingUser2.isEmpty()) {
            List<User> usersToSave = new ArrayList<>();

            if (existingUser1.isEmpty()) {
                User user1 = new User();
                user1.setFirstName("Max");
                user1.setLastName("Mustermann");
                user1.setEmail("max@mustermann.com");
                user1.setChatId("493192316");
                user1.setPassword(passwordEncoder.encode("password123"));
                user1.setRole(Role.PRIVATE_CLIENT);
                usersToSave.add(user1);
            }

            if (existingUser2.isEmpty()) {
                User user2 = new User();
                user2.setFirstName("Erika");
                user2.setLastName("Musterfrau");
                user2.setEmail("erika@musterfrau.com");
                user2.setPassword(passwordEncoder.encode("password123"));
                user2.setRole(Role.ADMIN);
                usersToSave.add(user2);
            }

            if (!usersToSave.isEmpty()) {
                userRepository.saveAll(usersToSave);
                System.out.println("Added " + usersToSave.size() + " new users to database.");
            } else {
                System.out.println("Users already exist. No new users added.");
            }
        } else {
            System.out.println("Users already exist. Skipping seeding.");
        }

        List<User> allUsers = (List<User>) userRepository.findAll();
        allUsers.forEach(user -> System.out.println("User: " + user.getEmail() + " ID: " + user.getId()));
    }

    private void seedArticles() {
        Map<String, Map<String, List<Article>>> categoryMap = new HashMap<>();

        Map<String, List<Article>> laptopSubcategories = new HashMap<>();
        laptopSubcategories.put("Apple", List.of(
                new Article("MacBook Pro", "Apple Laptop mit M2 Chip", 5, 25.00, "https://picsum.photos/200")
        ));
        laptopSubcategories.put("Dell", List.of(
                new Article("Dell XPS 15", "Leistungsstark und portabel", 3, 20.00, "https://picsum.photos/200")
        ));
        categoryMap.put("Laptop", laptopSubcategories);

        Map<String, List<Article>> werkzeugSubcategories = new HashMap<>();
        werkzeugSubcategories.put("Schraubenzieher", List.of(
                new Article("Bosch Akkuschrauber", "18V Akkuschrauber-Set", 10, 12.00, "https://picsum.photos/200")
        ));
        werkzeugSubcategories.put("Bohrmaschinen", List.of(
                new Article("Makita Bohrmaschine", "Robuste Schlagbohrmaschine", 6, 19.00, "https://picsum.photos/200")
        ));
        categoryMap.put("Werkzeug", werkzeugSubcategories);

        for (Map.Entry<String, Map<String, List<Article>>> mainEntry : categoryMap.entrySet()) {
            Category mainCategory = new Category();
            mainCategory.setName(mainEntry.getKey());
            mainCategory = categoryRepository.save(mainCategory);

            Map<String, List<Article>> subMap = mainEntry.getValue();
            for (Map.Entry<String, List<Article>> subEntry : subMap.entrySet()) {
                Category subCategory = new Category();
                subCategory.setName(subEntry.getKey());
                subCategory.setParent(mainCategory);
                subCategory = categoryRepository.save(subCategory);

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

    /**
     * Seed rentals for test users.
     */
    private void seedRentals() {
        List<User> users = (List<User>) userRepository.findAll();
        User user = users.getFirst();

        List<ArticleInstance> articleInstances = (List<ArticleInstance>) articleInstanceRepository.findAll();

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setRentalStatus(RentalStatus.ACTIVE);
        rentalRepository.save(rental);

        LocalDate rentalStart = LocalDate.now().minusDays(3);
        LocalDate rentalEnd = LocalDate.now().minusDays(1);
        int quantity = 3;
        Article article = articleInstances.get(0).getArticle();

        try {
            rentalServiceImpl.createRental(rental, article, rentalStart, rentalEnd, quantity);
            System.out.println("Successfully seeded rental for user: " + user.getEmail());
        } catch (IllegalArgumentException e) {
            System.out.println("Rental seeding failed: " + e.getMessage());
        }
    }

}
