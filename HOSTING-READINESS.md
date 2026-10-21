# Hosting- und Ausbauplan

Stand: 13. Oktober 2026

## Aktueller Status

Das Repository kann als **Single-Tenant-Staging** containerisiert gestartet werden. Es ist noch
nicht für den produktiven Betrieb mit mehreren unabhängigen Kunden freigegeben.

Vorhanden sind insbesondere Kunden, Angebote, Rechnungen, Zahlungen, Steuern, Zahlungsarten,
Einstellungen, PDF-Ausgabe und eine einfache Benutzeranmeldung. Der Frontend-Produktionsbuild
funktioniert.

## Kritische Punkte vor dem Verkauf

1. **Mandantentrennung:** Die Datenmodelle und generischen CRUD-Abfragen besitzen keine
   durchgängige `tenantId`. Ein gemeinsamer Datenbestand für mehrere Betriebe wäre deshalb ein
   unvertretbares Datenschutzrisiko. Für den ersten Markttest wird eine eigene Instanz mit eigener
   Datenbank je Kunde empfohlen. Erst danach sollte ein getestetes Shared-SaaS-Modell eingeführt
   werden.
2. **Geheimnisse:** `backend/.env` und `frontend/.env` waren bereits versioniert. Das Ergänzen der
   `.gitignore` schützt nur neue Dateien. Bereits veröffentlichte Passwörter, Datenbank-URLs und
   JWT-Schlüssel müssen rotiert und gegebenenfalls aus der Git-Historie entfernt werden.
3. **Qualität:** ESLint meldet im Bestand 141 Fehler und 78 Warnungen. Der Build ist erfolgreich,
   doch die Befunde müssen modulweise behoben und durch automatisierte Tests abgesichert werden.
4. **Tests:** Es fehlen automatisierte API-, Berechtigungs-, Abrechnungs- und End-to-End-Tests.
5. **Betrieb:** Backups mit regelmäßig geprüftem Restore, Monitoring, zentralisierte Logs,
   Fehleralarmierung, TLS, E-Mail-Zustellung und ein Updateprozess fehlen noch.
6. **Lizenz:** Das Projekt steht laut Repository unter AGPL-3.0. Bei Bereitstellung über ein Netzwerk
   müssen Nutzer grundsätzlich Zugang zum korrespondierenden Quellcode der betriebenen Version
   erhalten. Branding, Drittanbieter-Abhängigkeiten und eigene Änderungen sollten vor dem Verkauf
   rechtlich geprüft werden.
7. **Lizenzdienst:** Die Anwendung besitzt nun eine Startaktivierung und serverseitige API-Sperre.
   Für installationsübergreifende Einmal-Aktivierung muss `LICENSE_DATABASE` zentral und besonders
   geschützt betrieben werden. Mittelfristig empfiehlt sich ein separater HTTPS-Lizenzdienst, damit
   Kundensysteme keine Zugangsdaten zur Lizenzdatenbank erhalten.

## Empfohlene Zielarchitektur

### Phase 1: Pilotbetrieb (eigene Instanz je Handwerksbetrieb)

- ein Compose-Stack und eine eigene MongoDB-Datenbank je Kunde
- eigene Domain/Subdomain und TLS-Zertifikat
- getrennte Uploads und Backups
- keine Datenvermischung zwischen Kunden möglich
- einfachere DSGVO-Auskunft, Export und Löschung

### Phase 2: echtes Multi-Tenant-SaaS

- `Tenant`-Modell und unveränderliche `tenantId` in jedem fachlichen Datensatz
- Tenant-Kontext ausschließlich aus dem verifizierten Login-Token, niemals aus Request-Daten
- zentrale Query-Schicht, die jede Lese-/Schreiboperation nach `tenantId` begrenzt
- zusammengesetzte Indizes, beispielsweise `{ tenantId, number }`
- Rollen und Rechte: Inhaber, Büro, Bauleitung, Monteur, Steuerberatung
- tenantbezogene Einstellungen, Nummernkreise, Dateien und Audit-Logs
- automatisierte Isolationstests, die Zugriffe zwischen zwei Testmandanten ausschließen

## Fachlicher Ausbau für Handwerksbetriebe

Priorität A (verkaufbarer Kern):

- Aufträge/Projekte aus angenommenen Angeboten
- Leistungen und Materialkatalog mit Einheiten, Einkauf und Verkauf
- Termin-, Mitarbeiter- und Einsatzplanung
- Zeiterfassung und mobile Baustellennachweise
- Abschlags-, Teil- und Schlussrechnungen sowie Gutschriften
- Dokumente, Fotos, Unterschriften und Kundenhistorie
- fortlaufende, tenantbezogene Nummernkreise und unveränderbare Belegstände

Priorität B (deutscher Markt):

- E-Rechnung (XRechnung und ZUGFeRD) mit Validierung
- DATEV-kompatibler Export und Steuerberaterzugang
- GoBD-orientiertes Änderungsprotokoll und Aufbewahrungskonzept
- Mahnwesen, Zahlungserinnerungen und OP-Liste
- DSGVO-Funktionen: Export, Lösch-/Sperrkonzept, AV-Verträge und Löschfristen

Priorität C (Wachstum):

- Kundenportal für Angebote, Rechnungen und Freigaben
- wiederkehrende Wartungen und Serviceverträge
- Lager, Fahrzeuge, Geräte und Prüfintervalle
- Banking-/Zahlungsabgleich und Webhooks
- Tarif-, Abonnement- und Rechnungslogik für das SaaS-Angebot

## Lokales Staging

1. `.env.hosting.example` nach `.env` kopieren und Werte ersetzen.
2. Einen zufälligen `JWT_SECRET` mit mindestens 32 Zeichen setzen.
3. `LICENSE_DATABASE` und eine pro Installation eindeutige `LICENSE_INSTANCE_ID` setzen.
4. `docker compose up --build` ausführen.
5. Die App ist standardmäßig auf Port 8080 und der Healthcheck unter `/health` erreichbar.

Die Compose-Datei stellt bewusst nur eine Staging-Grundlage dar. Für Produktion gehören davor ein
TLS-Reverse-Proxy oder Load-Balancer, externe Backups, Monitoring und beschränkter Datenbankzugriff.

## Abnahmekriterien vor dem ersten zahlenden Kunden

- keine offenen kritischen oder hohen Sicherheitsbefunde
- vollständige Mandantentrennung oder nachweislich eigene Instanz je Kunde
- grüne CI für Lint, Unit-, API- und End-to-End-Tests
- getesteter Backup- und Restore-Lauf
- dokumentierter Export aller Kundendaten und Kündigungsprozess
- Impressum, Datenschutz, AV-Vertrag, Nutzungsbedingungen und Lizenzhinweise geprüft
- Rechnungs- und Steuerlogik durch fachkundige Stelle geprüft
