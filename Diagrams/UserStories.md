# User Stories

## Admin

### 1. Artikel anlegen und verwalten
**Als Admin** möchte ich Artikel verwalten und erstellen mit Attributen wie Name, Beschreibung, Preis, Bilder und Verfügbarkeiten (Kalender).

- **Akzeptanzkriterien:**
  - Der Admin kann neue Artikel mit den Attributen Name, Beschreibung, Preis, Bilder und Verfügbarkeiten (Kalender) anlegen.
  - Der Admin kann bestehende Artikel bearbeiten oder löschen.
  - Änderungen werden in Echtzeit gespeichert und für den Mieter sichtbar gemacht.

---

### 2. Buchungen einsehen und verwalten
**Als Admin** möchte ich eine Übersicht über Buchungen und deren Status (angefragt, bestätigt, zurückgegeben) sehen sowie den Mietzeitraum verwalten.

- **Akzeptanzkriterien:**
  - Der Admin sieht eine Liste aller Buchungen mit Mietzeitraum und Status.
  - Der Admin kann Buchungsstatus manuell ändern.
  - Der Admin kann spezifische Buchungen suchen oder filtern (z. B. nach Artikel oder Zeitraum).

---

### 3. Rechnungserstellung für Buchungen
**Als Admin** möchte ich, dass das System automatisch eine Rechnung nach Buchungsbestätigung erstellt und an den Mieter sendet.

- **Akzeptanzkriterien:**
  - Nach Bestätigung einer Buchung generiert das System automatisch eine PDF-Rechnung mit allen Details.
  - Die Rechnung wird automatisch per E-Mail an den Mieter gesendet.
  - Der Admin kann eine Kopie der Rechnung einsehen und erneut senden.

---

### 4. Rechnungsversand
**Als Admin** möchte ich einen möglichst automatisierten Rechnungsversand nach Bezahlung an den Kunden.

- **Akzeptanzkriterien:**
  - Das System sendet die Rechnung automatisch, sobald die Bezahlung abgeschlossen ist.
  - Rechnungen enthalten Details zur Buchung (Artikel, Zeitraum, Kosten, Steuern).
  - Der Admin kann überprüfen, ob eine Rechnung erfolgreich gesendet wurde.

---

### 5. Benutzerverwaltung
**Als Admin** möchte ich Benutzer verwalten können (neue Benutzer anlegen, bestehende Benutzer bearbeiten oder deaktivieren).

- **Akzeptanzkriterien:**
  - Der Admin kann neue Benutzer mit Name, E-Mail und Rolle anlegen.
  - Der Admin kann Benutzerdaten bearbeiten oder sie deaktivieren.
  - Der Admin kann eine Liste aller registrierten Benutzer einsehen und durchsuchen.

---

### 6. Erinnerung an Rückgaben
**Als Admin** möchte ich, dass das System automatisch Benachrichtigungen an Mieter und mich sendet,  
**damit** ich sicherstellen kann, dass Artikel rechtzeitig zurückgegeben werden.

- **Akzeptanzkriterien:**
  - Das System sendet automatisch Erinnerungen 24 Stunden vor dem Rückgabetermin.
  - Das System sendet Benachrichtigungen bei verspäteten Rückgaben.
  - Der Admin kann festlegen, ob er Benachrichtigungen per E-Mail oder Bot erhalten möchte.

---

## 7. Erinnerung an Rückgaben
**Als Admin** möchte ich, dass das System automatisch Benachrichtigungen an Mieter und mich sendet,  
**damit** ich sicherstellen kann, dass Artikel rechtzeitig zurückgegeben werden.

### Akzeptanzkriterien:
- Erinnerungen werden 48 Stunden vor der Rückgabe automatisch ausgelöst.
- Eine Benachrichtigung wird bei verspäteten Rückgaben automatisch gesendet.

---

## 8. Berichte und Statistiken
**Als Admin** möchte ich Berichte über Buchungen, Umsätze und Nutzungshäufigkeiten der Artikel einsehen,  
damit ich die Leistung und Auslastung des Systems analysieren kann.

### Akzeptanzkriterien:
- Berichte können nach Zeitraum und Status gefiltert werden.
- Berichte können als Excel exportiert werden.

---

## 9. Kategorisierung der Artikel
**Als Admin** möchte ich Artikel in Kategorien einordnen, damit sie für Mieter leichter auffindbar sind.

### Akzeptanzkriterien:
- Artikel können einer oder mehreren Kategorien zugeordnet werden.
- Kategorien können vom Admin verwaltet werden.

---

## 9. Schaden- oder Verlustverwaltung
**Als Admin** möchte ich Schäden oder Verluste an gemieteten Artikeln dokumentieren, damit ich Gebühren für Schäden oder Verluste berechnen und in Rechnung stellen kann.

### Akzeptanzkriterien:
- Schäden können mit Details und Bildern dokumentiert werden.
- Gebühren für Schäden oder Verluste werden automatisiert berechnet und dem Mieter in Rechnung gestellt.

---

## 10. Zahlungsverfolgung
**Als Admin** möchte ich eine Übersicht über alle Zahlungen und ausstehenden Beträge haben,damit ich offene Rechnungen besser verwalten und Mahnungen automatisieren kann.

### Akzeptanzkriterien:
- Der Admin sieht eine Übersicht aller Zahlungen und offenen Beträge.
- Automatische Erinnerungen werden bei ausstehenden Beträgen versendet.

---

## 11. Inventarprüfung und Wartung
**Als Admin** möchte ich den Zustand von Artikeln prüfen und Wartungszeiträume festlegen, damit defekte Artikel nicht gebucht werden können.

### Akzeptanzkriterien:
- Artikel können als "in Wartung" markiert werden, was die Buchung blockiert.
- Zustandsprüfungen können dokumentiert werden.

## Kunde

## 1. Artikel buchen
**Als Mieter** möchte ich Artikel auswählen und ein Start- sowie Enddatum angeben, damit ich eine Buchung mit berechnetem Mietpreis abschließen kann.

### Akzeptanzkriterien:
- Der Mieter wählt ein Start- und Enddatum für die Buchung.
- Der Mietpreis wird automatisch basierend auf der Mietdauer berechnet.
- Der Mieter kann die Buchung abschließen.
---

## 2. Bezahlung der Buchung
**Als Mieter** möchte ich eine Zahlungsmethode auswählen und die Bezahlung über einen externen Zahlungsdienst (z. B. PayPal) abschließen, damit die Buchung bezahlen kann.

### Akzeptanzkriterien:
- Der Mieter kann eine Zahlungsmethode auswählen.
- Der Buchungsbetrag wird über einen externen Zahlungsdienst (z. B. PayPal) bezahlt.

---

## 3. Rechnungserstellung für Buchungen (automatisch)
**Als Mieter** möchte ich nach Abschluss der Zahlung eine Rechnung erhalten, damit ich eine Übersicht der Buchungsdetails habe.

### Akzeptanzkriterien:
- Die Rechnung enthält alle relevanten Details zur Buchung.

---

## 4. Profildaten verwalten
**Als Mieter** möchte ich meine persönlichen Daten, wie Name und Adresse, aktualisieren, damit ich sicherstellen kann, dass meine Informationen korrekt sind.

### Akzeptanzkriterien:
- Änderungen an den persönlichen Daten werden gespeichert.
- Zahlungsmethoden können hinzugefügt oder entfernt werden.

---

## 5. Benachrichtigungen verwalten
**Als Mieter** möchte ich auswählen können, wie und wann ich Benachrichtigungen (z. B. E-Mail oder SMS) erhalte,  damit ich relevante Informationen wie Buchungsbestätigungen oder Rückgabefristen rechtzeitig bekomme.

### Akzeptanzkriterien:
- Optionen für Buchungsbestätigungen, Rückgabefristen und Zahlungserinnerungen sind verfügbar.

---

## 6. Artikel suchen und filtern
**Als Mieter** möchte ich Artikel nach Kategorien, Verfügbarkeit und Preis filtern können,  damit ich passende Artikel einfach finden kann.

### Akzeptanzkriterien:
- Filter- und Suchoptionen liefern korrekte und relevante Ergebnisse.


