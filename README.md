# AutoDziennik

**Kompletna historia samochodu — prywatny, inteligentny organizer pojazdu.**

AutoDziennik zastępuje papierową książkę serwisową, notatki, faktury, kalendarze i listy zadań.
Wszystkie informacje o pojeździe — naprawy, terminy, koszty, tankowania, dokumenty, harmonogram
wymian — są w jednym miejscu, uporządkowane chronologicznie i dostępne z komputera, telefonu
oraz tabletu.

To aplikacja dla właścicieli samochodów, nie system dla warsztatów ani portal społecznościowy.

**Stack:** Next.js 14 (App Router) · TypeScript · React 18 · PWA · zero zależności UI
**Dane:** local-first — wszystko w przeglądarce, bez konta, bez backendu, bez reklam.

---

## Funkcje

### Garaż
Dowolna liczba pojazdów: osobowe, motocykle, dostawcze, kampery, przyczepy, klasyki. Każdy
z własną kartą, zdjęciem i **całkowicie oddzielną historią**. Sprzedane auta trafiają do
archiwum w trybie tylko do odczytu — historia zostaje na zawsze.

### Panel kondycji
Jedna lampka kontrolna odpowiada na pytanie *„czy z autem wszystko OK?"* — zielona, bursztynowa
albo czerwona. Pod nią: przypomnienia o zaległych i nadchodzących terminach, aktualny przebieg
w stylu odometru, wydatki miesiąca i roku, liczba napraw do wykonania i części do kupienia.

### Oś czasu
Całe życie pojazdu na jednej „drodze": zakup, naprawy, wymiany, terminy, objawy, dokumenty —
chronologicznie, z grupowaniem latami i opcjonalnym pokazaniem tankowań. Klik w wydarzenie
prowadzi do właściwej sekcji.

### Historia napraw
Data, przebieg, opis usterki, wykonane prace, **części z producentami i numerami katalogowymi**,
koszty części i robocizny, warsztat, mechanik, gwarancje, notatki.

### Naprawy do wykonania
Priorytety i statusy: nowe → zaplanowane → oczekuje na części → w warsztacie → wykonane.
Naprawa oznaczona jako wykonana **automatycznie przechodzi do historii**.

### Części do kupienia
Producent, numer katalogowy, ilość, cena, sklep, link. Statusy: do kupienia → zamówiona →
kupiona → zamontowana. Kupione części wliczają się do kosztów.

### Harmonogram wymian
Presety elementów eksploatacyjnych (olej, filtry, rozrząd, hamulce, opony…), pilnowanie
**dat i przebiegów jednocześnie** — co pierwsze wypadnie.

### Planer
Prognoza wymian i budżetu na **6 / 12 / 24 miesiące**. Aplikacja liczy Twoje tempo jazdy
(km/mies.) z historii wpisów i przewiduje, kiedy realnie osiągniesz planowany przebieg.

### Przeglądy i terminy ważności
Badanie techniczne, OC, AC, Assistance, LPG, gwarancje, klimatyzacja, gaśnica, apteczka
i własne terminy — każdy z przypomnieniem z zadanym wyprzedzeniem.

### Objawy
Coś stuka, cieknie, świeci? Szybka notatka z datą. Jeden klik zamienia objaw
w zaplanowaną naprawę.

### Tankowania
Automatycznie liczone: **średnie spalanie** (metoda pełnego baku), **koszt 100 km**,
wydatki miesięczne. Koszt tankowania wylicza się z litrów × ceny, jeśli nie podasz go wprost.

### Koszty
Zestawienia po kategoriach (części, robocizna, paliwo, ubezpieczenia i przeglądy, zakupy)
z paskami udziału, tabela miesięczna dla wybranego roku, całkowity koszt utrzymania pojazdu.

### Dokumenty i galeria
Faktury, paragony, polisy, badania, instrukcje, gwarancje — plus zdjęcia auta, napraw
i uszkodzeń. Obrazy są kompresowane przed zapisem, licznik pokazuje zajętość pamięci.

### Schowek
Cyfrowy schowek na stałą wiedzę o aucie: kod lakieru, zalecany olej, ciśnienia opon,
momenty dokręcania, typy żarówek, kod radia, rozmieszczenie bezpieczników i własne notatki.

### Wyszukiwarka
Przeszukuje wszystko — naprawy, plany, części, wymiany, terminy, dokumenty, notatki, objawy,
tankowania, schowek — w jednym pojeździe albo w całym garażu. **Toleruje literówki**
(normalizacja polskich znaków + odległość Levenshteina), grupuje wyniki i prowadzi
bezpośrednio do podświetlonego wpisu.

### Raport
Profesjonalny raport historii pojazdu: dane, naprawy, wymiany, terminy, koszty, statystyki
paliwa, oś czasu, dokumenty i zdjęcia. Widok do druku → „zapisz jako PDF" w przeglądarce —
idealny przy sprzedaży auta.

### Przekazanie pojazdu
Sprzedajesz? Wygeneruj **pakiet przekazania** (JSON) — opcjonalnie bez prywatnych notatek
i numeru polisy. Nowy właściciel importuje plik i przejmuje pełną, ciągłą historię serwisową.

### Kopia zapasowa
Eksport i import całości jako JSON. To samo służy do przenoszenia danych między urządzeniami.

---

## Szybki start

```bash
npm install
npm run dev
# http://localhost:3000
```

## Wdrożenie na Vercel

Projekt jest gotowy pod Vercel bez dodatkowej konfiguracji — brak zmiennych środowiskowych,
brak bazy danych.

**Z GitHuba (zalecane):**

```bash
git remote add origin <adres-repo>
git push -u origin main
# następnie vercel.com → Add New → Project → import repozytorium
```

**Z CLI:**

```bash
npm i -g vercel
vercel          # podgląd
vercel --prod   # produkcja
```

Vercel wykrywa Next.js automatycznie (framework zadeklarowany także w `vercel.json`).

## PWA

- `public/manifest.json` + ikony 192 / 512 / maskable
- `public/sw.js`: nawigacje z sieci (aplikacja zawsze świeża po deployu), statyki
  `_next/static` cache-first, offline — strona zastępcza
- nagłówek `Cache-Control: no-cache` dla `sw.js` w `next.config.mjs`, żeby aktualizacje
  service workera nie utykały w cache

Na telefonie: „Dodaj do ekranu głównego" — aplikacja działa jak natywna.

## Architektura

```
app/
  page.tsx               garaż: pojazdy, dodawanie, import/eksport, szukanie globalne
  auto/[id]/page.tsx     pojazd: panel, oś czasu i wszystkie sekcje w zakładkach
  auto/[id]/raport/      raport do druku / zapisu jako PDF
components/
  EntitySection.tsx      generyczny CRUD sterowany definicjami sekcji
  Dashboard.tsx          panel kondycji (lampka + przypomnienia + statystyki)
  Timeline.tsx           oś czasu — „droga" z wydarzeniami
  Analytics.tsx          statystyki paliwa, koszty, planer wymian
  FilesSection.tsx       dokumenty i galeria (kompresja obrazów)
  SearchPanel.tsx        wyszukiwarka z tolerancją literówek
  VehicleForm.tsx        dane pojazdu
lib/
  types.ts               model danych
  db.tsx                 kontekst + localStorage + eksport/import + pakiet przekazania
  sections.ts            definicje pól, statusów i presetów wszystkich sekcji
  calc.ts                spalanie, koszty, alerty, planer, oś czasu
  search.ts              indeks + wyszukiwanie (normalizacja PL, Levenshtein ≤ 1)
```

Sekcje danych są deklaratywne: nowa sekcja to definicja pól w `lib/sections.ts`,
resztę (formularz, lista, statusy, edycja) obsługuje `EntitySection`.

## Prywatność i ograniczenia wersji local-first

- Dane żyją w `localStorage` konkretnej przeglądarki (limit ~5 MB — stąd kompresja zdjęć
  i licznik zajętości). **Regularna kopia zapasowa to obowiązek właściciela.**
- Nic nie opuszcza urządzenia: brak konta, brak analityki, brak reklam.
- Synchronizacja między urządzeniami i udostępnianie linkiem (mechanik, rodzina, kupujący)
  wymagają backendu — architektura jest na to gotowa: wystarczy podmienić warstwę
  `lib/db.tsx` na API, model danych zostaje bez zmian.

## Plany rozwoju

- konto opcjonalne: synchronizacja i udostępnianie pojazdu z poziomami dostępu
  (odczyt / dodawanie / edycja / zarządzanie)
- bezpieczny token przekazania pojazdu online
- powiadomienia push o terminach

---

*AutoDziennik ma być premium książką serwisową i osobistym dziennikiem pojazdu —
nie programem księgowym. Prostota, szybkość i zaufanie przed funkcjami flotowymi.*
