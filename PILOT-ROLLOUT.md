# Pilotbetrieb mit fünf Unternehmen

Bis eine vollständig getestete Mandantentrennung vorhanden ist, wird jedes Unternehmen als eigener
Stack mit eigener Datenbank, eigener Domain, eigenen Uploads, eigener Lizenzinstanz und eigenem
Backup betrieben. Datenbanken oder Upload-Verzeichnisse dürfen nicht zwischen Unternehmen geteilt
werden.

## Mindestkonfiguration pro Unternehmen

- eindeutige `DATABASE`, `LICENSE_INSTANCE_ID` und Domain
- eigener zufälliger `JWT_SECRET` mit mindestens 32 Zeichen
- `LICENSE_REQUIRE_CENTRAL=true` mit zentraler `LICENSE_DATABASE`
- `EMAIL_DELIVERY_REQUIRED=true`, `RESEND_API` und verifizierter `RESEND_FROM`
- ausschließlich HTTPS; Port 8888 darf nicht öffentlich erreichbar sein
- mindestens zwei getrennte Eigentümerzugänge und persönliche Benutzerkonten
- tägliches verschlüsseltes Offsite-Backup und monatlich protokollierter Restore-Test
- Monitoring von `/health` (Prozess) und `/ready` (Betriebsbereitschaft)

## Rollen

- `owner`: vollständiger Zugriff einschließlich Eigentümerverwaltung
- `admin`: Administration, Benutzer, Verkauf, Zahlungen und Lager
- `accounting`: Rechnungen und Zahlungen
- `sales`: Kunden, Angebote und Rechnungen
- `warehouse`: Lagerpflege; Verkaufsdaten nur lesend
- `viewer`: ausschließlich lesender Zugriff

Alle schreibenden API-Aufrufe angemeldeter Benutzer werden ohne Request-Inhalte im `AuditLog`
protokolliert. Die letzten Einträge sind für Owner/Admin über `GET /api/audit/list` abrufbar.

## Abnahme je Pilot

1. Firmen- und Steuereinstellungen fachlich prüfen.
2. Testkunde, Angebot, Rechnung, Zahlung, Storno und Gutschrift vollständig durchspielen.
3. PDF sowie E-Mail-Zustellung an interne Testadressen prüfen.
4. Benutzer jeder verwendeten Rolle anmelden und die Rechte kontrollieren.
5. Backup erstellen und in eine leere Testdatenbank zurückspielen.
6. Erst danach echte Kunden- und Rechnungsdaten importieren.

Die weitere fachliche und technische Reihenfolge steht in `PRODUCT-ROADMAP.md`.
