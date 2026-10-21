# WIEpilot

WIEpilot ist das ERP-/CRM-System für Rechnungen, Angebote, Auftragsbestätigungen, Einkauf, Lager, Ausgaben, Projekte und Zeiterfassung.

Das System basiert auf React, Node.js, Express und MongoDB. WIEdesign betreut Entwicklung, Betrieb und Support.

## Funktionen

- Kunden-, Angebots- und Rechnungsverwaltung
- Zahlungen, Mahnwesen und wiederkehrende Rechnungen
- Auftragsbestätigungen und PDF-Ausgabe
- Lieferanten, Bestellungen und Wareneingänge
- Artikel, Lagerbestand, Kategorien und Bestandsbewegungen
- Projekte, Ausgaben und Zeiterfassung
- Rollen, Audit-Protokoll und Lizenzverwaltung

## Lokale Entwicklung

Voraussetzungen: Node.js 24, npm 11 und MongoDB.

```bash
npm --prefix backend install
npm --prefix frontend install
npm run setup
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:8888`

Weitere Hinweise stehen in [INSTALLATION-INSTRUCTIONS.md](INSTALLATION-INSTRUCTIONS.md) und [OPERATIONS.md](OPERATIONS.md).

## Qualitätssicherung

```bash
npm run verify
```

## Support

WIEdesign

[hi@wiedesign.at](mailto:hi@wiedesign.at)

[www.wiedesign.at](https://www.wiedesign.at)

## Lizenz und Herkunft

Dieses Projekt steht unter der GNU Affero General Public License v3.0. WIEpilot basiert auf einem Open-Source-Projekt; die ursprünglichen Urheber- und Lizenzhinweise bleiben erhalten.
