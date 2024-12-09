package com.example.Rentify.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bezeichnung;
    private String beschreibung;
    private int stueckzahl;
    private double grundpreis;
    private String bildUrl;

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
