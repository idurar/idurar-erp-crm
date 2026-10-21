# WIEpilot – Betrieb

## Unterstützte Laufzeit

- Node.js 24 LTS (`nvm use` liest `.nvmrc`)
- MongoDB 7 oder neuer
- npm 11

## Ersteinrichtung

Vor dem ersten `npm run setup` im Backend müssen `DATABASE`, ein mindestens 32 Zeichen langes `JWT_SECRET` und ein mindestens 12 Zeichen langes `SETUP_ADMIN_PASSWORD` gesetzt sein. Optional sind `SETUP_ADMIN_EMAIL`, `SETUP_ADMIN_NAME` und `SETUP_ADMIN_SURNAME`.

Danach:

```powershell
npm --prefix backend run setup
npm --prefix backend run db:migrate
npm --prefix backend run db:indexes
```

## Lizenzierung

Beim Start prüft das Frontend den Lizenzstatus, bevor Login oder ERP geladen werden. Ohne aktive
Lizenz sind zusätzlich alle geschäftlichen API- und Download-Routen serverseitig gesperrt.

`LICENSE_DATABASE` muss in Produktion auf eine zentrale, von allen Installationen gemeinsam
verwendete MongoDB zeigen. Nur dadurch kann ein Schlüssel installationsübergreifend genau einmal
aktiviert werden. Die ERP-Datenbank unter `DATABASE` bleibt davon getrennt. `LICENSE_INSTANCE_ID`
muss für den zentralen Betrieb als stabiler, pro Kundeninstallation eindeutiger Wert gesetzt
werden. Bis der zentrale Dienst eingerichtet ist, fällt die Anwendung auf die lokale ERP-Datenbank
und eine automatisch erzeugte Installations-ID zurück. `LICENSE_REQUIRE_CENTRAL=true` erzwingt
später die zentrale Konfiguration, ohne den lokalen Erststart vorzeitig zu blockieren.

Die zehn initialen Schlüssel werden beim Setup ausschließlich als SHA-256-Fingerprints importiert.
Bei einer bestehenden Installation geschieht dies einmalig mit:

```powershell
npm --prefix backend run license:seed
```

Weitere Schlüssel werden zeilenweise in einer temporären Textdatei bereitgestellt und zentral
importiert. Der Befehl gibt keine Schlüssel aus; die Quelldatei sollte danach sicher gelöscht werden:

```powershell
npm --prefix backend run license:import -- "C:\sicher\neue-lizenzen.txt"
```

`LICENSE_ENFORCEMENT=false` ist ausschließlich als ausdrücklicher lokaler Entwicklungs-Bypass
vorgesehen und darf in Produktion nicht verwendet werden.

## Sicherungen

Mit installierten MongoDB Database Tools wird ein komprimiertes `mongodump`-Archiv erzeugt. Ohne Database Tools erstellt das Projekt automatisch ein portables EJSON-Backup, das BSON-Typen wie ObjectIds und Datumswerte erhält.

```powershell
npm --prefix backend run db:backup
```

Die Archive landen im ignorierten Ordner `backend/backups`. Für eine automatische tägliche Sicherung kann dieser Befehl in der Windows-Aufgabenplanung hinterlegt werden. Sicherungen sollten zusätzlich verschlüsselt außerhalb des Rechners gespeichert und regelmäßig testweise wiederhergestellt werden.

Wiederherstellung in eine leere Datenbank:

```powershell
mongorestore --uri="mongodb://127.0.0.1:27017/wiepilot" --archive="PFAD-ZUM-BACKUP.archive.gz" --gzip --drop
```

`--drop` löscht vorhandene Collections. Deshalb ausschließlich nach zusätzlicher Sicherung und mit geprüfter Ziel-URL verwenden.

Ein EJSON-Backup wird so wiederhergestellt:

```powershell
npm --prefix backend run db:restore -- "PFAD-ZUM-BACKUP.ejson" --apply
```

Auch dieser Befehl ersetzt den vorhandenen Datenbestand vollständig.

## Qualitätsprüfung

```powershell
npm --prefix backend test
npm run lint
npm run build
```

## Rechnungsregeln

- Bezahlte, stornierte und rückerstattete Rechnungen sind nicht mehr bearbeitbar.
- Nur unbezahlte Entwürfe dürfen gelöscht werden.
- Ausgestellte Rechnungen werden stattdessen mit dokumentiertem Grund storniert.
- Rechnungsnummer und Jahr sind in MongoDB eindeutig.
- Wiederkehrende Pläne erzeugen alle 15 Minuten fällige Rechnungen als neue Entwürfe.
- Ein Plan läuft erst, nachdem seine Ursprungsrechnung veröffentlicht wurde.
- Automatisch erzeugte Entwürfe werden niemals selbstständig veröffentlicht oder versendet.
