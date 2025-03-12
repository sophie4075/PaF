package com.example.Rentify.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Getter
    private String bezeichnung;
    @Column(columnDefinition = "TEXT")
    private String beschreibung;
    private int stueckzahl;
    private double grundpreis;
    private String bildUrl;

    @ManyToMany
    @JoinTable(
            name = "article_category",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleInstance> articleInstances; // Beziehung zu ArticleInstance

    public Article(String bezeichnung, String beschreibung, int stueckzahl, double grundpreis, String bildUrl) {
        this.bezeichnung = bezeichnung;
        this.beschreibung = beschreibung;
        this.stueckzahl = stueckzahl;
        this.grundpreis = grundpreis;
        this.bildUrl = bildUrl;
    }
}
