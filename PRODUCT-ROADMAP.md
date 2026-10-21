# Produkt-Roadmap

## Bereits umgesetzt

- Kunden, Angebote, Rechnungen, Gutschriften, Zahlungen und einfache Mahnerinnerungen
- Artikel, Kategorien, Bestandsbewegungen und Stichtagsbestand
- Projekte/Aufträge und projektbezogene Zeiterfassung
- Lieferanten, Einkaufsbestellungen, Ausgaben und Ausgabenkategorien
- Wareneingänge mit Teilmengen, Überlieferungsschutz und automatischer Lagerbuchung
- persönliche Benutzerkonten, Rollen/Rechte und Audit-Log
- lokale Lizenzaktivierung, zentrale Lizenzkonfiguration und Betriebschecks
- Backup-/Restore-Werkzeuge, CI, Unit-Tests und Produktionsbuild

## Vor jedem Pilotstart zwingend

- eine getrennte Instanz und Datenbank je Unternehmen
- Zugangsdaten und frühere Geheimnisse rotieren
- E-Mail-Absender verifizieren und Testzustellung durchführen
- TLS, Reverse Proxy, Monitoring und Fehleralarmierung einrichten
- automatisches Offsite-Backup plus dokumentierten Restore-Test durchführen
- je Betrieb Nummernkreise, Steuern, Pflichtangaben und Rechnungstexte fachlich abnehmen
- Auftragsverarbeitungsvertrag, Datenschutz, Impressum und Nutzungsbedingungen prüfen

## Nächste Produktstufe

1. Einsatzplanung mit Kalender, Mitarbeitern und Projektzuordnung
2. mobile Baustellenberichte, Fotos, Dokumente und Unterschriften
3. Abschlags-, Teil- und Schlussrechnungen
4. Mahnstufen, OP-Liste und Zahlungseingangsabgleich
5. XRechnung und ZUGFeRD inklusive externer Validator-Prüfung
6. DATEV-Export und Steuerberaterzugang
7. DSGVO-Export, Sperrung, Löschfristen und dokumentierte Datenlöschung
8. unveränderbares Belegjournal und GoBD-orientiertes Aufbewahrungskonzept
9. Kundenportal für Angebote, Freigaben, Rechnungen und Dokumente

## Erst nach erfolgreichem Pilotbetrieb

- Shared-SaaS-Mandantentrennung mit unveränderlicher `tenantId` in jedem Datensatz
- zentrale Tenant-Query-Schicht und automatisierte Isolationstests
- tenantbezogene Dateien, Einstellungen, Nummernkreise, Jobs und Audit-Logs
- Abonnement-, Tarif- und Abrechnungslogik
- getrennte Worker für E-Mail, wiederkehrende Rechnungen und Exporte

Eine Funktion gilt erst als fertig, wenn Rechteprüfung, Validierung, Auditierung, Migration,
API-Tests, Browser-Test, Backupauswirkung und Betriebsdokumentation abgenommen sind.
