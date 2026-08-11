# EMA Arzneimittelsuche

Eine schnelle, barrierearme Suche in den zentral zugelassenen Humanarzneimitteln der European Medicines Agency (EMA).

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
