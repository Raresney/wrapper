# Future Ideas

## Performance & UX

### GitHub data caching (landing page)
Re-fetch-ul GitHub e declanșat la fiecare apăsare de Generate, chiar dacă user + perioadă sunt identice.
Soluție: cache sessionStorage cu TTL 5-10 min, keyed pe `${username}:${period}`. Dacă cache-ul e valid, sare direct la analyze + navigate.

### Tone switching fără re-generate
Acum, schimbarea tonului (funny → brutal → motivational) necesită revenire pe landing + re-fetch complet GitHub.
Soluție: buton de schimbare ton direct pe pagina de slides, care face doar un nou apel `/api/narrative` cu noul ton — fără GitHub, fără analyze.

### Narrative fetch în paralel cu navigarea
Pipeline actual: GitHub → analyze → **navigate** → narrative.
Narrative-ul pornește abia după ce pagina de slides s-a montat. Ar putea fi declanșat imediat după analyze, înainte de navigate, și rezultatul transmis via sessionStorage sau URL state.

---

## Infrastructură

### Rate limiting distribuit (Upstash Redis)
Rate limiter-ul actual e în memorie — pe Vercel fiecare instanță serverless are propriul bucket, neîmpărțit cu celelalte instanțe paralele.
Soluție: înlocuit cu Upstash Redis (`@upstash/ratelimit`) pentru limite reale distribuite cross-instance.

### OG image dinamic per user
`app/opengraph-image.tsx` generează același preview pentru toți.
Soluție: OG image generat din datele profilului (commits, archetype, username) folosind `ImageResponse` din Next.js — fiecare wrapped URL are propriul thumbnail când e distribuit pe social media.

---

## Features

### Buton Retry pentru narrative
Când LLM-ul pică și se afișează fallback-ul, singura opțiune e refresh.
Soluție: buton „Regenerate" vizibil pe slide-ul intro (sau în ShareModal) care re-apelează `/api/narrative` fără să re-fetch-uiască GitHub.

### Deep link la slide specific
Nu există cale să trimiți pe cineva direct la un anumit slide.
Soluție: sync slide index în URL ca query param (`/wrapped/username?slide=3`) — la load, pagina sare direct la slide-ul respectiv.

### Keyboard navigation
Săgețile stânga/dreapta pentru navigarea între slides pe desktop.

### Tema persistată în localStorage
Preferința de temă (Space / WorldCup) e în sessionStorage — se pierde la tab nou sau la revenire ulterioară.
Soluție: mutată în localStorage, cu aceeași logică de hydration.

---

## WC-specific

### WC desktop full slide — trade-off viteză vs decorațiuni
Captură full slide WC desktop exclude `wc-pawcup-scene` (astronomul, constelațiile, luna) pentru viteză.
Dacă se doresc decorațiunile în captura share, `wc-pawcup-scene` trebuie reincluded — cu prețul unui render mai lent.
O soluție intermediară: remove doar sub-scenele ascunse (slide-urile inactive) și păstrează doar scena curentă activă.
