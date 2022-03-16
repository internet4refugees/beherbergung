# Beherbergung Software

**Contact:** <internet-for-refugees@lists.c3d2.de>

## Login und Authentifizierung

Die Authentifizierung/Login ist zweistufig, als Erstes wirst du nach deinem Organisations-Login gefragt.
**Benuztername:** 
**Login:** 

Danach siehst du einen minimalen Dialog, welcher dich nach deinen Missions-spezifischen Login -Credentials fragt. Wenn der Login erfolgreich war, solltest du einen Tabellenkopf sehen.

## Nach Einträgen Suchen

- Prinzipiell ist der Kopf jeder Spalte interaktiv. Durch schreiben in den Spalten Kopf können Suchkriterien zusammen gestellt werden.
Die Suchergebnisse werden dann direkt in der Tabelle darunter dargestellt.

### Navigation der UI
- **Tabelle zu groß:**Ich möchte noch auf den Slider an der Kante zwischen Map und Tabelle aufmerksam machen um auch den rechten Rand der Tabelle betrachten zu
können.

- **Struktur:** Auf der unteren hälfte der Oberfläche ist eine Karte wo die verschiedenen Wohnungen eingetragen der Tabelle eingetragen sind. Es wird garantiert das die Wohnung in dem jeweiligen grauen Kreis ist. Bei genauen Ortsangaben ist das Zentrum des Kreises der Ort.

- **Random Einträge:** Die meisten Spalten enthalten Zeichenketten also nicht von irritierenden oder über spezifizierte Einträge.


### Suchen

[](../graphics/table.png)

- **Filter erzeugen:** Die Tabelle kann nach den meisten Spalten gefiltert werden. Dafür einfach in der Zeile zwischen dem Tabellenkopf und der ersten Zeile mit Angeboten eingeben. Mit dem Filtersymbol das in dieser Zeile in
jeder Spalte ist, können weitere Optionen fürs Filtern ausgewählt werden. z.B. „enthält den eingegebenen Text“ oder „Spalten die angezeigt werden sollen, müssen einen Wert haben der mindestens so groß wie der eingegebene Wert ist“. Bei den meisten Spalten haben wir bereits eine sinnvolle Vorauswahl.


- **Spalten Typen:** Der Spaltenkopf besteht aus Felder, womit sich suchen lässt. Das Format des Spaltenkopfs ist dabei abhängig von der jeweiligen Spalte mögliche Formate sind z.B Zeichenketten, Ganzzahlen, Checkboxes oder Datumsangaben.

[](../graphics/city_column.png)

- **Filter anpassen:** Die Filtermethode für einen Spaltenkopf ist in den meisten Fällen die Gleichheit. Diese kann aber auch verändert werden durch die Trichter-Funktion (siehe Bild).
Mögliche Filtermethoden sind z.B `contains`, `equals`, `starts with` ...

- **Filter Zurücksetzen:** F5 lädt die Seite neu um setzt somit alle Filter zurück.

- **Tabelle Sortieren** Die Tabelle kann nach beliebigen Spalten sortiert werden. Dafür einfach auf die Überschrift der Spalte klicken z. B. „Beds“ oder „km“. Nochmal darauf klicken dreht die Sortierreihenfolge um. Beim dritten Klick wird die Sortierung aufgehoben.

### Nutzung der Karte

- In der Tabelle gibt es die Spalte Distanz, diese Distanz wird von aktuellen Karten Mittelpunkt zu der jeweiligen Wohnung berechnet.

- Wenn du z.B nach Orten im Dresdner Zentrum sucht richtest du deine Karte so aus das diese auf das Zentrum zeigt und sortierst dann die Einträge in der Tabelle nach der Distanz absteigend.


### Fehler / Bugs gefunden.

- Bitte schreibe uns eine Mail mit einer kurzen Beschreibung wie es zu diesem Fehler kam. Mit einer Anleitung wie man diesen Fehler reproduzieren kann. Screenshots und Bilder vom Debug-Modus sind meistens auch hilfreich zudem potenziell deine Browser und korrespondierende Version.

