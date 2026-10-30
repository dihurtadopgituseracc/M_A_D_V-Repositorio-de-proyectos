# Contexto del proyecto

## Propósito

Aplicación web para explorar proyectos de videojuegos, revisar su avance y sus solicitudes de colaboración, y acceder a los canales de contacto de cada equipo. Es un prototipo frontend: el catálogo es local y los datos analíticos se guardan solo en memoria por defecto. No hay backend de analítica ni persistencia global de solicitudes o eventos.

## Recorrido de ejecución

1. `index.html` define el documento, el título actual de pestaña (`Proyectos abiertos | MADV`) y carga `src/main.tsx` dentro de `#root`.
2. `src/main.tsx` importa los estilos globales y monta React.
3. `src/App.tsx` es una fachada que reexporta `src/app/App.tsx`.
4. `src/app/App.tsx` decide qué vista mostrar: landing, repositorio, detalle del proyecto o detalle de una solicitud.
5. `src/data/projects.ts` proporciona los datos que consumen las vistas y componentes.

## Estructura

```text
.
├── index.html                    # Shell HTML y título de la pestaña
├── package.json                  # Scripts y dependencias del proyecto
├── pnpm-lock.yaml                # Versiones fijadas por pnpm
├── .env.example                  # Variables de ejemplo para analítica local/API
├── tsconfig.json                 # Configuración TypeScript y alias @/*
├── vite.config.ts                # Vite, React, Tailwind, Figma Make y alias
├── vitest.config.ts              # Alias y configuración de pruebas
├── .mise.toml                    # Versiones de Node y pnpm
├── .gitignore                    # Excluye dependencias, builds, secretos y estado local
├── AGENTS.md                     # Instrucciones de trabajo para agentes
├── CLAUDE.md                     # Reutiliza AGENTS.md
├── PROJECT_CONTEXT.md            # Este mapa de contexto mantenido
├── dist/                         # Salida de `pnpm build` (generada, no versionada)
├── public/
│   └── assets/
│       ├── branding/
│       │   └── LogoMADV.svg      # Logo de la landing
│       ├── gallery/              # 12 láminas .svg del recorrido visual:
│       │                         # Titulo, Contexto1, Contexto2, Objetivos,
│       │                         # Problemas, Propuesta, Roadmap, Usuario,
│       │                         # Entornos, EntornoEsp, ArbolProb, ArbustoProb
│       └── projects/             # Arte conceptual de las tarjetas de proyecto
│           ├── StewartCard.svg
│           ├── BTWCard.svg
│           └── BCCCard.svg
└── src/
    ├── main.tsx                  # Montaje de React e importación de CSS
    ├── App.tsx                   # Fachada hacia app/App.tsx
    ├── index.css                 # Tailwind v4, kit de marca y estilos globales
    ├── app/
    │   ├── App.tsx               # Selección de vista, navegación e instrumentación
    │   └── App.analytics.test.tsx # Pruebas DOM de interacciones bajo StrictMode
    ├── config/
    │   ├── environment.ts        # Selección segura del modo de analítica
    │   └── environment.test.ts   # Pruebas de configuración y valores por defecto
    ├── components/
    │   ├── common/
    │   │   ├── ArtPlaceholder.tsx # Arte conceptual decorativo con color por proyecto
    │   │   ├── LandingPopup.tsx   # Capa inicial de presentación (preparada, aún sin montar)
    │   │   ├── ScrollExpand.tsx   # Marco visual que se expande con el scroll de la landing
    │   │   └── ScrollExpand.css  # Estilos del componente ScrollExpand
    │   │   ├── Progress.tsx       # Barra de avance accesible con relleno CSS
    │   │   ├── SocialIcon.tsx     # Iconos de contacto social
    │   │   ├── Tag.tsx            # Etiqueta visual reutilizable
    │   │   └── ToolCard.tsx       # Presentación de una herramienta/área
    │   ├── needs/
    │   │   └── NeedCard.tsx       # Tarjeta interactiva de una solicitud
    │   └── projects/
    │       └── ProjectCard.tsx    # Tarjeta de proyecto en el repositorio
    ├── component/
    │   └── DepthCarousel.tsx      # Carrusel de profundidad reutilizado en la galería
    ├── constants/
    │   └── styles.ts             # Tokens TypeScript y clases tipográficas comunes
    ├── services/
    │   └── analytics/
    │       ├── analytics.types.ts # Eventos, contratos y validador
    │       ├── analytics.service.ts # Fachada, selección y manejo de fallos
    │       ├── local.adapter.ts   # Buffer de memoria inspeccionable
    │       ├── api.adapter.ts     # POST HTTP sin credenciales ni reintentos
    │       └── *.test.ts          # Validación y pruebas de adaptadores
    ├── data/
    │   └── projects.ts           # Catálogo local de proyectos y contenido asociado
    ├── pages/
    │   ├── LandingPage.tsx      # Portada y resumen de MADV
    │   ├── GalleryPage.tsx      # Carrusel de 12 imágenes, descripciones y visor 16:9
    │   ├── RepositoryPage.tsx    # Listado de proyectos
    │   ├── ProjectDetailPage.tsx # Detalle, avance, QR, herramientas y necesidades
    │   └── NeedDetailPage.tsx    # Detalle de una necesidad y contactos
    ├── types/
    │   └── project.ts            # Tipos Project, Need, Tool, Contact y secciones de detalle
    └── utils/
        └── scroll.ts             # Desplazamiento al inicio al navegar
```

## Navegación y vistas

- `RepositoryPage` recorre `projects` y presenta una tarjeta por proyecto; cada tarjeta completa abre los detalles del proyecto y su botón de colaboración conserva el registro de clic. Su identidad visual usa verdes eléctricos para diferenciar el catálogo de proyectos de la identidad amarilla de MADV. El encabezado comunica que son proyectos abiertos a colaboración (“Encuentra dónde aportar”) sin cambiar la navegación. “Volver a MADV” regresa a la portada y elimina `vista=repository` de la URL.
- La raíz (`/`) muestra `LandingPage`. El CTA “Repositorio abierto” navega a `?vista=repository`; “Saber más del proyecto” abre `?vista=gallery`.
- `GalleryPage` presenta `Titulo.svg`, `Contexto1.svg`, `Objetivos.svg`, `Problemas.svg`, `Roadmap.svg`, `Usuario.svg`, `Contexto2.svg`, `Entornos.svg`, `EntornoEsp.svg`, `Propuesta.svg`, `ArbolProb.svg` y `ArbustoProb.svg` desde `public/assets/gallery/` mediante `DepthCarousel`, sobre un fondo oscuro igual al carrusel y con tipografía clara. La descripción inferior cambia con la lámina activa y al tocar una tarjeta se abre el visor 16:9 a pantalla completa, con navegación, cierre y soporte de teclado; si un SVG no carga, se muestra su nombre como fallback.
- La landing presenta una lista breve de los proyectos existentes. Los contadores de proyectos y oportunidades se muestran en `RepositoryPage`, junto con el encabezado del catálogo. No añade proyectos ni modifica el catálogo.
- `LandingPopup` encapsula la futura capa inicial de presentación: usa `PopUp.svg` cuando ese recurso esté disponible, aparece una vez por sesión, escucha el primer toque/clic o Escape, activa un desvanecimiento de 450 ms y luego se desmonta. El componente aún no está montado en `LandingPage` y `public/assets/branding/PopUp.svg` todavía no existe; al agregarlos, la landing se mantiene debajo de la capa sin cambiar la navegación.
- La navegación entre landing, galería, repositorio, proyectos y necesidades cambia las vistas de forma instantánea, sin swipe ni slide horizontal.
- `LandingPage` incluye `ScrollExpand` con `LogoMADV.jpg` como recurso visual. La animación usa el scroll de la ventana para expandir el marco, revelar el contenido y mantener la navegación existente sin dependencias externas.
- Los recursos visuales se organizan en `public/assets/branding/`, `public/assets/gallery/` y `public/assets/projects/`. Se referencian desde la web anteponiendo `import.meta.env.BASE_URL` a `assets/<grupo>/<archivo>` para respetar la base de despliegue. El logo de MADV se encuentra en `public/assets/branding/LogoMADV.svg` y `LogoMADV.jpg`; las 12 láminas están en `gallery/` y el arte de tarjetas en `projects/`. Los archivos conservan sus nombres originales.
- `repository_view` se registra al entrar al listado, no al visitar la landing. `trackCurrentPageView` distingue el listado mediante `vista=repository`.
- Al seleccionar un proyecto, `app/App.tsx` actualiza el estado y agrega su ID a la query string: `?proyecto=<id>`.
- `proyecto=<id>` tiene prioridad sobre `vista`; por ello los enlaces directos y QR existentes continúan abriendo la ficha del proyecto.
- Al cargar la app, ese parámetro se resuelve contra `projects`; así los enlaces compartidos y los QR abren el detalle correspondiente. `popstate` sincroniza la vista cuando se navega atrás/adelante.
- El botón de regreso al repositorio elimina el parámetro `proyecto`.
- La analítica considera nueva vista el arranque de un documento, una apertura explícita de página por navegación o una transición `popstate`. `main.tsx` registra la vista inicial fuera de React y la protege contra reevaluaciones HMR; no se usan efectos de montaje para contar vistas, por lo que `StrictMode` y los renders repetidos no las duplican.
- Las necesidades tienen IDs canónicos en `src/data/projects.ts`, añadidos al modelo porque no existían antes. Los eventos usan esos IDs junto con el ID original del proyecto; no fabrican identificadores durante el registro.
- `ProjectDetailPage` muestra el resumen y estado del proyecto, las herramientas, sus solicitudes y un QR generado en tiempo de ejecución con `qrcode.react` (`QRCodeSVG`). El QR apunta a la URL del proyecto y ofrece compartirlo como imagen mediante Web Share API cuando el navegador lo permite, o descargarlo como PNG.
- `ProjectCard` y `ProjectDetailPage` muestran el arte opcional `Project.artImage`; si el equipo/progreso no está confirmado, `team` y `progress` aceptan `null` y la interfaz muestra “por confirmar” sin dibujar porcentajes ficticios.
- Al seleccionar una solicitud, `NeedDetailPage` muestra sus requisitos, entregable y contactos. Esa selección es estado local y no tiene una URL propia.
- Los botones para mostrar interés/aportar cambian el estado de la interfaz, pero no envían ni guardan información en un servidor.

## Modelo de eventos

El contrato discriminado está en `src/services/analytics/analytics.types.ts`. Todo evento incluye `event_name`, `category` (`page_view` o `click`) y `occurred_at` en ISO 8601. Los eventos con contexto incluyen `project_id`; las necesidades incluyen `need_id`, y los clics incluyen `target_id` cuando aplica. `isAnalyticsEvent(unknown)` valida forma, fecha, categoría, claves permitidas e IDs pertenecientes al catálogo.

Eventos instrumentados:

| Evento | Categoría | Datos de contexto |
| --- | --- | --- |
| `repository_view` | `page_view` | Entrada al repositorio |
| `project_view` | `page_view` | `project_id` |
| `need_view` | `page_view` | `project_id`, `need_id` |
| `collaborate_click` | `click` | `project_id`, `target_id`; `need_id` al aportar en una necesidad |
| `contact_click` | `click` | `project_id`, tipo de contacto como `target_id` |

Los objetivos de colaboración son `project_card`, `project_interest` y `need_contribution`. Un clic de colaboración no es una conversión: no existe evento de colaboración completada. La analítica no captura handles, URLs de contacto, nombres, correos, IPs, identificadores de sesión ni huellas digitales.

## Servicio y configuración de analítica

- Componentes llaman funciones de `analytics.service.ts`; no conocen `fetch`, almacenamiento, endpoints ni selección de adaptador.
- `environment.ts` lee `VITE_ANALYTICS_MODE` y `VITE_API_BASE_URL`. El modo predeterminado es `local`. API solo se activa cuando el modo vale `api` y la URL base es HTTP(S), válida y sin credenciales; si falta o es inválida, se usa modo local.
- `.env.example` muestra configuración local y un ejemplo comentado para API. Las variables `VITE_*` son públicas y nunca deben contener secretos.
- `local.adapter.ts` conserva eventos en un buffer en memoria de esta pestaña y los muestra en consola de desarrollo. `getEvents()` facilita su inspección; no usa `localStorage`, no sincroniza dispositivos y no representa estadísticas globales. El buffer se pierde al recargar o cerrar la pestaña.
- `api.adapter.ts` envía cada evento con un `POST` a `<VITE_API_BASE_URL>/api/events`, sin autenticación, reintentos ni credenciales. Errores HTTP y de conectividad llegan a la fachada, que los maneja sin lanzar excepciones a la interfaz.
- Activar backend después de implementarlo: definir `VITE_ANALYTICS_MODE=api` y `VITE_API_BASE_URL=https://<host-configurado>`, sin cambiar los componentes.

## Contrato futuro del backend

Este repositorio implementa el cliente HTTP, no el servidor. La persistencia compartida, la validación definitiva y las consultas agregadas no funcionan hasta que exista backend real.

### `POST /api/events`

Recibe un evento ya tipado. Ejemplo:

```json
{
    "event_name": "need_view",
    "category": "page_view",
    "occurred_at": "2026-10-14T12:00:00.000Z",
    "project_id": "ecos-de-umbra",
    "need_id": "ecos-audio"
}
```

Respuesta aceptada sugerida: `202 Accepted` con `{"accepted":true}` o `204 No Content`; el cliente solo depende de `response.ok`. Errores previstos: `400` esquema/fecha/categoría inválidos, `404` proyecto o necesidad inexistente, `413` cuerpo demasiado grande, `429` límite excedido y `500`/`503` error temporal del servicio. El servidor debe validar los IDs contra su catálogo y que cada necesidad pertenezca al proyecto, limitar tamaño y tasa de solicitudes, descartar propiedades personales/desconocidas y calcular agregados solo con eventos aceptados. No hay reintentos automáticos.

### `GET /api/projects/:id/analytics`

Consulta futura de estadísticas agregadas. Respuesta sugerida:

```json
{
    "project_id": "ecos-de-umbra",
    "totals": {
        "project_views": 120,
        "need_views": 38,
        "collaborate_clicks": 14,
        "contact_clicks": 9
    },
    "clicks_by_target": {
        "project_card": 5,
        "project_interest": 6,
        "need_contribution": 3
    },
    "needs": [
        { "need_id": "ecos-audio", "views": 18, "collaborate_clicks": 2 }
    ],
    "updated_at": "2026-10-14T12:05:00.000Z"
}
```

Errores previstos: `400` ID mal formado, `404` proyecto inexistente y `429` límite excedido. La implementación frontend de este GET queda pendiente junto con el servidor. No se requiere un endpoint de catálogo en esta fase; `src/data/projects.ts` sigue siendo la fuente del prototipo.

## Métricas y limitaciones

- Los agregados deben separar vistas de ficha, vistas de necesidad y clics por `target_id`. Los clics de contacto se cuentan por tipo de canal, no por destino privado.
- No se calculan sesiones únicas ni conversiones. Una conversión real requerirá una acción confirmada y una definición explícita; un clic no es suficiente.
- En local, los eventos son solo una traza temporal de desarrollo. En modo API, la base de datos del backend será la fuente de verdad.
- Recargas intencionales y aperturas repetidas cuentan como nuevas vistas. Bloqueadores, red desconectada, eventos descartados y uso desde varios dispositivos pueden causar subregistro; distintos dispositivos no se deduplican.
- El timestamp viene del cliente y no es una prueba confiable de orden o validez. El backend debe guardar su propio momento de recepción y aplicar sus reglas de aceptación.
- Contactos externos conservan su comportamiento normal de navegación; el envío analítico es asíncrono y no cancela el enlace.
- Los QR existentes no forman parte de la implementación de esta fase y no se modifican aquí.

## Modelo de datos

`src/types/project.ts` define:

- `Project`: identificador, título, género, equipo, avance, etapa, estado, descripción, herramientas, etiquetas, necesidades, contactos, acento y etiqueta de arte.
- `Need`: nombre, detalle, dedicación, herramienta, descripción, requisitos, entregable, estado opcional `proposed` para propuestas inferidas sin vacante confirmada y marca opcional `featured`.
- `Tool`: área y detalle.
- `Contact`: tipo (`whatsapp`, `instagram` o `discord`), etiqueta, identificador visible y URL.

`src/data/projects.ts` contiene actualmente a Stewart, Frecuencia Cero, Beat The World y Beast Card Clash. El primer registro conserva deliberadamente el ID estable `ecos-de-umbra` para mantener los enlaces y QR ya emitidos; el siguiente reemplazo del ID requiere una migración explícita para no mezclar analítica ni romper enlaces.

Stewart usa el arte conceptual `public/assets/projects/StewartCard.svg`, con una URL formada desde `import.meta.env.BASE_URL` para funcionar también en despliegues bajo una subruta. El SVG se versiona directamente en Git para evitar la dependencia de Git LFS que tenía la imagen PNG anterior. El GDD describe un ARPG de aventura, fantasía ligera y comedia, con siete reinos inspirados en Colombia, exploración top-down, combate lateral y un sistema de empatía. El equipo activo y el progreso no están confirmados; por eso `team` y `progress` aceptan `null`. Las necesidades y contactos permanecen vacíos hasta que el equipo confirme oportunidades reales.

Beat The World se incorporó desde `Beat_The_World_matriz_repositorio.xlsx`. Su ficha sigue el formato conciso de Frecuencia Cero: resumen, etapa y estado, género, avance, herramientas, etiquetas y colaboraciones. El GDD no declara solicitudes de colaboración; las dos ideas de apoyo derivadas de gameplay y del analizador musical se marcan `proposed` y requieren validación, no son vacantes abiertas.

Beast Card Clash se incorporó desde `Beast_Card_Clash_matriz_repositorio.xlsx` con el mismo formato conciso. La ficha resume la demo de cartas por turnos y narrativa point-and-click, el motor Godot y herramientas principales. El GDD menciona perfiles de arte, sonido, programación y organización; las propuestas de arte digital y programación en Godot se marcan `proposed` hasta que el equipo confirme su vigencia. Las propuestas no se contabilizan como oportunidades abiertas y no afirman disponibilidad.

## Estilos y marca

- El proyecto usa React 19, TypeScript, Vite 8 y Tailwind CSS v4.
- `src/index.css` importa Tailwind y mantiene las fuentes Figma, colores globales y arte decorativo del prototipo.
- `src/constants/styles.ts` exporta tokens TypeScript (`colors`, `typography`, `spacing`, `radii`, `shadows`, `motion`) y las clases compartidas `semi`, `reg`, `instr` y `wdth`. No todos los tokens están conectados actualmente a `index.css`; cambios de marca pueden requerir actualizar ambos y las clases Tailwind literales.
- Las páginas y componentes todavía tienen valores Tailwind literales, por ejemplo `text-[#...]` y `rounded-[...]`. Cambiar un token no modifica automáticamente esos literales; migrarlos si se requiere consistencia global.
- Las fuentes se descargan desde Google Fonts, por lo que su carga depende de conexión externa.

## Configuración y herramientas

- `vite.config.ts` configura React, Tailwind v4, plugins de Figma Make, el alias `@` hacia `src`, y el servidor de desarrollo. El puerto predeterminado es `8443`, configurable con `PORT`. `base` usa `FIGMA_PUBLIC_URL` cuando existe y `/` en caso contrario.
- `.figma/make/site.json` configura metadatos de Figma Make, incluyendo descripción y directivas de indexación. El título visible actual está escrito directamente en `index.html`.
- `tsconfig.json` activa TypeScript estricto y mapea `@/*` a `src/*`.
- `.mise.toml` declara Node 22 y pnpm 10.34.3.
- `oxfmt` es el formateador único del proyecto (`pnpm format`). Normaliza comillas dobles, sin punto y coma, y líneas largas en `src/` y en los archivos de configuración de la raíz.

## Comandos

```bash
pnpm install
pnpm dev       # Servidor Vite; por defecto en el puerto 8443
pnpm build     # Compilación de producción
pnpm preview   # Previsualización de la compilación
pnpm format    # Formato con oxfmt
```

Comandos de validación:

```bash
pnpm test              # Vitest: tipos, configuración, adaptadores e interacciones DOM
pnpm exec tsc --noEmit  # TypeScript estricto, incluyendo pruebas
pnpm build             # Compilación Vite de producción
pnpm format            # Formato con oxfmt
```

La suite cubre modo local, IDs válidos e inválidos, necesidad asociada al proyecto correcto, categorías, timestamp, propiedades extra, fallos HTTP/red, endpoint y payload del adaptador, valores de entorno seguros, vistas iniciales/directas, clics de colaborar/aportar/contacto, enlaces intactos, separación por proyecto y renders en `StrictMode`. La integración real del backend, su rate limiting, su persistencia y el endpoint GET quedan pendientes porque no hay servidor en este repositorio.

## Despliegue

El sitio es una SPA estática: `pnpm build` genera `dist/` y no necesita servidor propio ni backend.

- Host recomendado: Vercel, plan gratuito. Detecta Vite automáticamente.
- Configuración de build: comando `pnpm build`, directorio de salida `dist`.
- Publicación desde la carpeta local sin repositorio: `pnpm dlx vercel --prod` (requiere sesión) o `pnpm dlx vercel deploy --temporary --yes` para una URL anónima que expira en 60 minutos y puede reclamarse.
- Publicación continua: conectar el repositorio de GitHub al proyecto de Vercel; cada envío a la rama principal actualiza producción y cada rama o PR genera una vista previa.
- Rutas: la navegación usa query strings (`?vista=repository`, `?vista=gallery`, `?proyecto=<id>`), por lo que no se requiere reescritura de rutas en el host.
- Variables: `VITE_ANALYTICS_MODE` y `VITE_API_BASE_URL` se configuran en el panel del host, nunca en el repositorio. Sin ellas, la analítica queda en modo local.
- `.vercel` está excluido por `.gitignore`; `dist/` y `node_modules/` tampoco se versionan.

## Mantenimiento de este documento

Actualizar esta guía en la misma tarea que cualquier cambio de código, estructura, configuración, dependencia o comportamiento. Mantener el árbol, los flujos, las fuentes de verdad y los comandos fieles al estado actual. No agregar un changelog: documentar cómo funciona hoy el proyecto.
