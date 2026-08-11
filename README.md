# EMA Arzneimittelsuche

Eine schnelle, barrierearme Suche in den zentral zugelassenen Humanarzneimitteln der European Medicines Agency (EMA).

Die Anwendung ist als Progressive Web App (PWA) installierbar. Auf unterstützten
Android-Browsern erscheint eine direkte Installationsoption; auf iPhone und iPad
führt eine kurze Anleitung über „Zum Home-Bildschirm“. Die letzte erfolgreich
geladene Arzneimittelliste bleibt für die Offline-Suche verfügbar.

## Datenumfang

Die Anwendung zeigt ausschließlich Datensätze, deren Werte nach Entfernung von Leerzeichen und unabhängig von Groß-/Kleinschreibung den folgenden Bedingungen entsprechen:

- `category = Human`
- `medicine_status = Authorised`

Ausgegeben und durchsucht werden Handelsname, INN/Common Name, therapeutische MeSH-Gebiete und therapeutische Indikation. Jeder Treffer verlinkt auf die originale EMA-Seite.

## Aktualisierung

Ein GitHub-Workflow lädt die offizielle EMA-JSON-Datei zweimal täglich nach deren regulärer Aktualisierung. Vor der Veröffentlichung prüft das Importskript Struktur und Mindestanzahl der Datensätze. Bei einem Fehler bleibt die letzte gültige Datei bestehen.

Datenquelle: [European Medicines Agency](https://www.ema.europa.eu/en/about-us/about-website/download-website-data-json-data-format)

## Lokal prüfen

```bash
node scripts/build-data.mjs /pfad/zur/Medicines_output_medicines_en.json
npm test
npm run serve
```

Die Anwendung ist ein statisches Projekt ohne Laufzeit-Abhängigkeiten.

Für einen vollständigen PWA-Test muss sie über `http://localhost` oder HTTPS
aufgerufen werden. Beim ersten Online-Aufruf werden Oberfläche und EMA-Datensatz
lokal zwischengespeichert.
