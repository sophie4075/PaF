package com.example.Rentify.dto;

import java.util.List;

public class ArticleDto {
    private Long id;
    private String bezeichnung;
    private String beschreibung;
    private int stueckzahl;
    private double grundpreis;
    private String bildUrl;

    private List<ArticleInstanceDto> articleInstances;

    private List<CategoryDto> categories;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getBezeichnung() {
        return bezeichnung;
    }
    public void setBezeichnung(String bezeichnung) {
        this.bezeichnung = bezeichnung;
    }
    public String getBeschreibung() {
        return beschreibung;
    }
    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }
    public int getStueckzahl() {
        return stueckzahl;
    }
    public void setStueckzahl(int stueckzahl) {
        this.stueckzahl = stueckzahl;
    }
    public double getGrundpreis() {
        return grundpreis;
    }
    public void setGrundpreis(double grundpreis) {
        this.grundpreis = grundpreis;
    }
    public String getBildUrl() {
        return bildUrl;
    }
    public void setBildUrl(String bildUrl) {
        this.bildUrl = bildUrl;
    }
    public List<CategoryDto> getCategories() {
        return categories;
    }
    public void setCategories(List<CategoryDto> categories) {
        this.categories = categories;
    }

    public List<ArticleInstanceDto> getArticleInstances() {
        return articleInstances;
    }
    public void setArticleInstances(List<ArticleInstanceDto> articleInstances) {
        this.articleInstances = articleInstances;
    }
}
