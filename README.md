# Kampanjebygger

En enkel Next.js-applikasjon som tilbyr en to-trinns kampanjebygger for sosiale medier. Løsningen lar deg laste opp media, velge tjenester fra en forhåndsdefinert katalog, beskrive strategi og tjeneste, generere forslag til bilder og tekster samt planlegge publisering.

## Komme i gang

1. Installer avhengigheter:
   ```bash
   npm install
   ```
2. Start utviklingsserver:
   ```bash
   npm run dev
   ```
3. Åpne `http://localhost:3000/kampanje` i nettleseren for å bruke kampanjebyggeren.

> Merk: Applikasjonen bruker mock-funksjoner for å generere bilder og tekster. Disse kan byttes ut med faktiske AI-kall via f.eks. et API-endepunkt ved å oppdatere funksjonene i `lib/generators.ts`.
