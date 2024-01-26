<!-- PROJECT LOGO -->
<div align="center">
  <a href="[https://github.com/othneildrew/Best-README-Template](https://github.com/raphi98/GreenGuru)">
    <img src="images/logo-dark.png" alt="Logo" width="250" height="250">
  </a>

  <h3 align="center">Green Guru</h3>
    <p align="center">
    You Plant - We Care
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot][product-screenshot]

Our web app helps users take care of their plants and use resources like water and fertilizer better. This is important because we need to save resources and help the environment.

Our app gives users a special plan for each plant, so they know exactly how much water and fertilizer to use. This means nothing gets wasted. We also teach users about different plants, helping them choose and look after plants in a way that’s good for the environment.

The app is fun to use because you can earn points for taking care of your plants and see how your friends are doing with their plants. This makes everyone want to do better.

<p align="center">
    <h3>Team Members</h3>
    <li>David Possegger</li>
    <li>Florian Waltersdorfer</li>
    <li>Philipp Legner</li>
    <li>Raphael Ofner</li>
    <li>Sebastian Schretter</li>

## Built With
[![Python][Python.io]][Python-url]
[![Angular][Angular.io]][Angular-url]

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: images/screenshot.png

[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Python.io]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org


## Branching-Strategie
- `main`: Nur für stabile Releases.
- `dev`: Hauptentwicklungsbranch.
- `task/feature-name` : Feature-Branches wie im Team Planning, z.B. für "Add Plant Page (Frontend)" -> `task/add-plant-page`.
  
  Bitte bei den Feature-Branches nur an dem jeweiligen Feature arbeiten (Beispielsweise der Component in Angular) und nicht in anderen Bereichen des Codes Veränderungen durchführen, damit wir möglichst wenig Probleme mit Konflikten haben.

## Git Workflow
1. **Initialisierung und Setup:**
   - Alle Teammitglieder klonen das Repository und wechseln in den `dev`-Branch:
     ```bash
     git clone git@github.com:raphi98/GreenGuru.git
     git checkout dev
     ```

     Bei folgendem Fehler: `error: pathspec 'dev' did not match any file(s) known to git` einfach mit `git fetch` die Branches aktualisieren.


2. **Feature-Entwicklung (Beispiel: Sebastian mit `task/add-plant-page`):**
   - Neuen Branch vom `dev`-Branch erstellen:
     ```bash
     git checkout -b task/add-plant-page
     ```
   - Entwickeln, commiten und pushen (bitte nur wenn der Code auch funktioniert):
     ```bash
     git add .
     git commit -m "added logic and validation to add plants in the frontend"
     git push origin task/add-plant-page
     ```
   - Pull Request für den `dev`-Branch im GitHub-Repository erstellen.

3. **Code Review und Merge:**
   - Ein Teammitglied (z.B. Raphael) überprüft den Pull Request von Sebastian.
   - Nach der Überprüfung wird `task/add-plant-page` in `dev` gemerged.

4. **Regelmäßiges Update des `dev` Branches:**
   - So halten alle Teammitglieder ihren `dev`-Branch aktuell:
     ```bash
     git checkout dev
     git pull origin dev
     ```

5. **Konfliktlösung:**
   - Bei auftretenden Konflikten diese im eigenen Branch vor dem Merge lösen.

6. **Finalisierung und Release:**
   - Nach Abschluss der Entwicklungsphase wird `dev` in `main` gemerged, um eine neue Version zu veröffentlichen.

## Aufgaben und zugehörige Branches
Die Feature Branches sollen wie die Tasks im Team Planning genannt, kleingeschrieben und die Leerzeichen mit Bindestrichen ersetzt werden (z.B. Task "Edit User Page (Frontend)" -> "task/edit-user-page").
Bei Fragen schreibts mir einfach! :)

## Fehlerbehebung
Wenn der Django Server nicht start möchte `Error: Please select a Django Module`, dann über File -> Project Structure -> Modules -> Add Button(+) -> Import Module - >backend folder auswählen -> Next..Next..Next -> Assistenten abschließen -> Fertig

## Backend Server starten
Das Backend wird gestartet und mit dem 'sample_data' script werden automatisch Beispieldaten erstellt. <br>
Zum Einloggen im Backend gibt es einen Admin Account und drei User: <br>
| **Username** | **Passwort** | **Userrole** |
|--------------|:------------:|:------------:|
| admin        | admin        | admin        |
| Florian      | user         | user         |
| Raphael      | user         | user         |
| Sebastian    | user         | user         |
<h3>Windows</h3>
Einfach die 'startup.bat' Datei im backend Ordner ausführen.
Danach einmal auf Nachfrage mit 'yes' bestätigen.
<h3>Mac</h3>

1. Das Python environment starten ('activate' script im Ordner `backend\venv_greenguru\Scripts`)

2. In den Ordner `backend\wapdev2` wechseln

3. Folgende commands ausführen:


  ```bash 
  python manage.py flush
  python manage.py sample_data
  python manage.py runserver
<<<<<<< HEAD
  ```
=======
  ```
>>>>>>> dev
