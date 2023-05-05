<div align="center">
  <h1 align="center">Smartmat frontend</h1>
  <p align="center">
    Frontend til smartmat laget av Callum Gran, Nicolai Brand, Simen Grønnslett, Thomas Svendal, Tobias Orø, Carl Johan Gützkow (Scrum Master) i faget Systemutvikling 2 (IDATT2106) vår 2023.
  </p>
</div>

## Info

Oppgaven gikk ut på å utvikle en webapplikasjon hvor målet er å hjelpe husholdninger å redusere matsvinn.

Dette er frontend repositoriet til scrum-prosjektet i faget Systemutvkling 2. Prosjektet har også et repository til backend/API-delen av prosjektet som kan finnes [her](https://gitlab.stud.idi.ntnu.no/scrum-team-4/scrum-backend).

Resten av dokumentasjonen til applikasjonen er skrevet som del av sluttrapporten.

## Kjør frontend lokalt

### Forutsetninger

For å kjøre programmet trenger du:

- node versjon 16 eller høyere
- yarn

OBS:
For å kunne snakke med API'et må du ha [backend](https://gitlab.stud.idi.ntnu.no/scrum-team-4/scrum-backend) kjørende på `localhost:8080`.

### Installasjon og kjøre opp lokalt fra terminalen

1. Klon repositoriet
   ```sh
   git clone git@gitlab.stud.idi.ntnu.no:scrum-team-4/scrum-frontend.git
   ```
2. Bytt mappe til det nedlastede repositoriet
   ```sh
   cd scrum-frontend
   ```
3. Last ned alle tredjeparts avhengigheter yarn

   ```sh
   yarn
   ```

   obs: yarn laster ned alle avhengigheter som ligger i `package.json` filen.

4. Kjør frontend-lokalt

   ```sh
   yarn dev
   ```

5. Programmet vil nå kjøre opp på `localhost:5173` (eller annet: se resultatet fra forrige kommando). Åpne en nettleser å gå til lenken.

   > Ikke glem å ha [backend](https://gitlab.stud.idi.ntnu.no/scrum-team-4/scrum-backend) kjørende.

### Andre kommandoer

- `yarn build` - Kompilerer og minifiserer for produksjon
- `yarn test:unit`- Kjør enhetstester
- `yarn test:unit --coverage` - Kjører testene med coverage ved hjelp av c8. Coverage kjører alle undermappene av `/src` utenom `api` og `plugins`. Se `vite.config.ts` for konfigurasjonsfilen.
- `yarn test:e2e` - Kjør end-to-end tester
- `yarn test:e2e:dev` - Kjør end-to-end tester interaktivt i ett browser vindu
- `yarn test:e2e:unix` - Kjør end-to-end tester (hvis du har en unix maskin)
- `yarn test:e2e:dev:unix` - Kjør end-to-end tester interaktivt i ett browser vindu (hvis du har en unix maskin)
- `yarn prettier` - Formatter kildekoden
- `yarn api-generate` - Generer interfaces og service funksjoner i typescript i tråd med DTO- og kontroller klassene i backend. Dette krever at [backend](https://gitlab.stud.idi.ntnu.no/scrum-team-4/scrum-backend) er kjørende.

### Test data

Applikasjonen kommer med en rekke realistiske testdata:

- 220 ingredienser
- 520 matvare-produkter
- 45 oppskrifter

## Kontakt

Carl J. Gützkow - carljgu@stud.ntnu.no (scrum master)

Nicolai H. Brand - nicolahb@stud.ntnu.no

Callum Gran - callumg@stud.ntnu.no

Thomas H. Svendal - thosve@stud.ntnu.no

Simen J. Grønnslett - simenjgr@stud.ntnu.no

Tobias Olaussen Orø - tobiasoo@stud.ntnu.no
