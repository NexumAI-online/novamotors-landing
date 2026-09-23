# Nova Motors Export — Landing

Landing page de **Nova Motors Export**, importadora privada de coches de lujo / alto rendimiento **de Dubái a España** (corredor Madrid ↔ Dubái). Sitio de una sola página, **trilingüe (EN / ES / AR)**, estático y desplegado en Vercel.

- **Producción:** https://novamotors-landing.vercel.app
- **Stack:** HTML + CSS + JavaScript vanilla. **Sin framework, sin build, sin dependencias.** Solo archivos estáticos.

---

## 1. Cómo levantarlo en local

No hay `npm install` ni compilación. Necesitas cualquier servidor estático (los `fetch`/rutas absolutas `/…` no funcionan abriendo el HTML con `file://`, hay que servirlo por HTTP):

```bash
# Python
python -m http.server 8099
# → http://localhost:8099

# o con Node
npx serve .
```

Editas `index.html` / `styles.css` / `script.js`, recargas el navegador, y listo.

---

## 2. Estructura del proyecto

```
novamotors-landing/
├── index.html      # Toda la estructura + textos (inglés = base). Cada nodo traducible lleva data-i18n.
├── styles.css      # Sistema de diseño completo (tokens CSS, responsive, RTL árabe).
├── script.js       # i18n, menú móvil, reveals, parallax, contadores, acordeón FAQ, form demo.
├── README.md       # Este archivo (traspaso técnico).
├── IDEA.md         # La idea / concepto de negocio (contexto para el copy y el producto).
├── branding/       # Manual de marca oficial (PDF), logo original, paletas, tipografía, guías web.
├── assets/
│   ├── hero.jpg        # Fondo del hero (coche)
│   ├── ambient.jpg     # Fondo de la banda con cita (parallax)
│   ├── car-1.jpg       # Mercedes-AMG G63  (inventario, foto real)
│   ├── car-2.jpg       # Corvette Stingray (inventario, foto real)
│   ├── car-3.jpg       # Mercedes GLE 450  (inventario, foto real)
│   ├── logo-full.png   # Logo completo NM + wordmark
│   ├── nm-mono.png     # Monograma NM (el que usa la nav)
│   └── favicon.png
├── .gitignore      # ignora /.vercel
└── .vercel/        # vínculo con el proyecto de Vercel (NO commitear; ver despliegue)
```

**No hay carpeta de código fuente aparte**: `index.html`, `styles.css` y `script.js` en la raíz **son** el sitio.

---

## 3. Sistema de diseño (manual de marca — respetar)

El manual oficial completo está en la carpeta **`branding/`** (PDF de identidad de marca, logo original `logoNM.png`, y las guías de color, tipografía y web). Reglas duras:

| Rol | Color | Hex |
|---|---|---|
| Fondo | Obsidian | `#0A0A0A` |
| Superficie | Graphite | `#1C1C1E` |
| Texto principal | Polished Silver | `#C9CDD2` |
| Texto secundario | Chrome | `#7E858C` |
| **Acento único** | **Leather** | **`#A9825B`** |
| Claro | Bone | `#F3F2F2` |

- **Un solo acento (Leather), ≤3% de la superficie**, y solo en numeración/datos — **nunca en texto corrido**.
- **Prohibido:** rojo, degradados saturados, un segundo color de acento, recolorear el logo (solo plata/blanco/negro).
- **Tipografía:** `Archivo` (display 200/300), `Archivo Narrow` (specs, versalitas, tracking `.14em`, cifras tabulares), `Noto Kufi Arabic` (árabe). Se cargan desde Google Fonts en el `<head>`.
- Los tokens viven como variables CSS al inicio de `styles.css` (`--bg`, `--silver`, `--leather`, `--r:14px` para el redondeo, etc.). **Cambiá el token, no el valor a mano en cada regla.**

---

## 4. Sistema trilingüe (EN / ES / AR) — lo más importante de entender

**Inglés es el idioma por defecto.** El HTML está escrito en inglés y ese es el texto base.

- Cada texto traducible en `index.html` lleva un atributo **`data-i18n="clave"`**. Los placeholders llevan **`data-i18n-ph="clave"`**.
- Las traducciones a **ES** y **AR** viven en el objeto `I18N = { es:{…}, ar:{…} }` dentro de `script.js`.
- Al cargar, `script.js` captura el texto inglés original de cada `[data-i18n]` (como `data-en`), y `setLang(lang)` intercambia `textContent`/placeholder por la clave correspondiente.

### Para editar o agregar texto:
1. Escribe/edita el texto **en inglés** directamente en `index.html`, poniéndole un `data-i18n="mi_clave"` único.
2. Añade `mi_clave` con su traducción en **ambos** diccionarios `es` y `ar` de `script.js`. (Si falta una clave, ese idioma cae al inglés.)

### Árabe (RTL):
- `setLang('ar')` pone `body.ar` + `dir="rtl"` y activa la fuente Kufi.
- Hay reglas específicas en el bloque `body.ar { … }` de `styles.css`. **Ojo con dos cosas:**
  - `letter-spacing:0` obligatorio en árabe (si no, se rompe la unión de letras).
  - Los valores latinos dentro de texto árabe (specs, precios) usan `unicode-bidi:plaintext` para que no se inviertan (ej. `585 CV` no debe salir como `CV 585`). Ver `.specs`, `.ladder__row b`, `.card__ref`.
- **Regla de contenido:** cada vista debe ser 100% de un idioma. **No mezclar** español con inglés en la misma pantalla.

---

## 5. Contenido / negocio (contexto para el copy)

Nova importa coches **a la carta de Dubái a España**: depósito inicial, inspección en Dubái, el cliente **paga directo al vendedor** (Nova no toca el dinero), y Nova gestiona export, transporte marítimo (~30–35 días), aduanas, homologación, ITV y matriculación. Entrega total 45–60 días. Ahorros típicos 20–45% vs. mercado español. Impuestos aplicables al importar: arancel + IVA.

La página incluye: hero, proceso/sourcing, **inventario "Importaciones recientes"** (3 coches reales con escalera de 3 precios: compra en Dubái → puesto en España → precio de mercado + % de ahorro), sedes/stats, **garantías** (inspección+reembolso y garantía mecánica en España vía talleres colaboradores), **FAQ** (acordeón, 8 preguntas), contacto y footer.

> ⚠️ **REGLA CRÍTICA:** la parte pública debe decir **NOVA MOTORS** en todo momento. Aunque parte del contenido provino de un dossier de otra denominación comercial del mismo negocio, **nunca escribir otro nombre de marca en el sitio.** Todo es Nova.

---

## 6. Despliegue (Vercel)

**Auto-deploy activado (Git → Vercel).** El repo de GitHub está conectado al proyecto de Vercel, así que **no hace falta usar la CLI de Vercel para publicar**:

- Cada **push a la rama `main`** → deploy automático a **producción** (https://novamotors-landing.vercel.app).
- Cada push a otra rama o Pull Request → deploy de **preview** con su propia URL (útil para revisar antes de mergear).

O sea: el desarrollador solo trabaja con Git. `git push` y listo.

```bash
git add -A
git commit -m "mi cambio"
git push          # → Vercel publica solo en ~30-60s
```

Verificar tras el push (evitar cachés): `curl -I https://novamotors-landing.vercel.app` → debe dar `200`.

**Deploy manual (opcional, solo si tenés acceso al proyecto Vercel):**
```bash
vercel deploy --prod --yes
```
Datos del proyecto (en `.vercel/project.json`): proyecto `novamotors-landing`, team `nexumai-onlines-projects`.

### Dominio propio
Aún se sirve en `novamotors-landing.vercel.app`. Falta (opcional) conectar el dominio definitivo desde el panel de Vercel → Settings → Domains.

---

## 7. Cómo verificar cambios (recomendado antes de desplegar)

Este sitio se construyó verificando **visualmente** con capturas reales, no a ciegas. Lección aprendida: **no dar por bueno un cambio de UI sin verlo renderizado**, especialmente en móvil y en árabe (RTL). Sirve cualquier flujo: DevTools responsive, capturas con Chrome headless / Puppeteer a 390px y 360px en EN/ES/AR, y comprobar que no haya scroll horizontal (`document.documentElement.scrollWidth === clientWidth`).

---

## 8. Backlog / mejoras posibles (no empezadas)

- Sección de **desglose de costes con ejemplo** completo (arancel + IVA + logística) — el contenido existe en el material de negocio.
- **Más coches reales** en el inventario (hay ~28 importaciones reales disponibles con foto + specs + precios).
- **Formulario de contacto funcional** (hoy es demo, no envía a ningún backend). Conectarlo a un endpoint / email / CRM.
- Conectar el **dominio propio**.

---

## 9. Convenciones al tocar el código

- Vanilla, sin dependencias. Mantenelo así salvo necesidad real.
- Rutas de assets **absolutas** (`/assets/…`) — por eso hay que servir por HTTP, no `file://`.
- `script.js` es una IIFE única; cada bloque de comportamiento está separado y comentado (i18n, nav, reveals, parallax, counters, FAQ, form).
- Reveals on-scroll son **progressive enhancement**: el contenido es visible por defecto sin JS (clase `.js` en `<html>`) y hay una red de seguridad por timeout, para que nada quede invisible si el observer falla.
