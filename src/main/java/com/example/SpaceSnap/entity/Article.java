package com.example.SpaceSnap.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Artikel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Automatische ID-Generierung
    private Long id;

    private String bezeichnung;
    private String beschreibung;
    private int stueckzahl;
    private double grundpreis;
    private String bildUrl;

    public Artikel(String bezeichnung, String beschreibung, int stueckzahl, double grundpreis, String bildUrl) {
        this.bezeichnung = bezeichnung;
        this.beschreibung = beschreibung;
        this.stueckzahl = stueckzahl;
        this.grundpreis = grundpreis;
        this.bildUrl = bildUrl;
    }
}
