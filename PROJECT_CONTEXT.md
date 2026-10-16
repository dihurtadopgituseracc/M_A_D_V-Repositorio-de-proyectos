# Contexto del proyecto

## Propósito

Aplicación web para explorar proyectos de videojuegos, revisar su avance y sus solicitudes de colaboración, y acceder a los canales de contacto de cada equipo. Es un prototipo frontend: el catálogo es local y los datos analíticos se guardan solo en memoria por defecto. No hay backend de analítica ni persistencia global de solicitudes o eventos.

## Recorrido de ejecución

1. `index.html` define el documento, el título actual de pestaña (`Repositorio abierto | MADV`) y carga `src/main.tsx` dentro de `#root`.
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
├── AGENTS.md                     # Instrucciones de trabajo para agentes
├── CLAUDE.md                     # Reutiliza AGENTS.md
├── PROJECT_CONTEXT.md            # Este mapa de contexto mantenido
├── public/
│   └── assets/
│       ├── images/               # Imágenes compartidas; URL pública relativa a BASE_URL
│       │   ├── LogoMADV.svg      # Logo de la landing
│       │   └── gallery/
│       │       └── StewartCard.png # Arte conceptual usado por Stewart
│       ├── Titulo.svg            # Lámina de título para la galería
│       ├── Contexto1.svg         # Lámina de contexto
│       ├── Objetivos.svg         # Lámina de objetivos
│       ├── Problemas.svg         # Lámina de problemas
│       ├── Roadmap.svg           # Lámina de roadmap
│       ├── Usuario.svg           # Lámina de usuario
│       └── otros SVG             # Recursos visuales de las láminas
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
    │   │   ├── Progress.tsx       # Barra de avance accesible con relleno CSS
    │   │   ├── SocialIcon.tsx     # Iconos de contacto social
    │   │   ├── Tag.tsx            # Etiqueta visual reutilizable
    │   │   └── ToolCard.tsx       # Presentación de una herramienta/área
    │   ├── needs/
    │   │   └── NeedCard.tsx       # Tarjeta interactiva de una solicitud
    │   └── projects/
    │       └── ProjectCard.tsx    # Tarjeta de proyecto en el repositorio
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
    │   ├── GalleryPage.tsx      # Galería de seis imágenes y visor 16:9
    │   ├── RepositoryPage.tsx    # Listado de proyectos
    │   ├── ProjectDetailPage.tsx # Detalle, avance, QR, herramientas y necesidades
    │   └── NeedDetailPage.tsx    # Detalle de una necesidad y contactos
    ├── types/
    │   └── project.ts            # Tipos Project, Need, Tool y Contact
    └── utils/
        └── scroll.ts             # Desplazamiento al inicio al navegar
```

## Navegación y vistas

- `RepositoryPage` recorre `projects` y presenta una tarjeta por proyecto.
- La raíz (`/`) muestra `LandingPage`. El CTA “Repositorio abierto” navega a `?vista=repository`; “Saber más del proyecto” abre `?vista=gallery`.
- `GalleryPage` presenta las seis láminas SVG `Titulo.svg`, `Contexto1.svg`, `Objetivos.svg`, `Problemas.svg`, `Roadmap.svg` y `Usuario.svg` desde `/assets/`, en una columna móvil, dos columnas en tablet y tres en escritorio. Al pulsar una se abre un visor 16:9 a pantalla completa con navegación, cierre y soporte de teclado; si un SVG no carga, se muestra su nombre como fallback.
- La landing presenta cantidades calculadas del catálogo local y una lista breve de los proyectos existentes. No añade proyectos ni modifica el catálogo.
- Los recursos visuales compartidos van en `public/assets/` y se referencian desde la web anteponiendo `import.meta.env.BASE_URL` a `assets/<archivo>` para respetar la base de despliegue. El logo de MADV se encuentra en `public/assets/images/LogoMADV.svg` y se usa en el encabezado de la landing. Las seis láminas SVG de la galería ya se encuentran en la raíz de assets.
- `repository_view` se registra al entrar al listado, no al visitar la landing. `trackCurrentPageView` distingue el listado mediante `vista=repository`.
- Al seleccionar un proyecto, `app/App.tsx` actualiza el estado y agrega su ID a la query string: `?proyecto=<id>`.
- `proyecto=<id>` tiene prioridad sobre `vista`; por ello los enlaces directos y QR existentes continúan abriendo la ficha del proyecto.
- Al cargar la app, ese parámetro se resuelve contra `projects`; así los enlaces compartidos y los QR abren el detalle correspondiente. `popstate` sincroniza la vista cuando se navega atrás/adelante.
- El botón de regreso al repositorio elimina el parámetro `proyecto`.
- La analítica considera nueva vista el arranque de un documento, una apertura explícita de página por navegación o una transición `popstate`. `main.tsx` registra la vista inicial fuera de React y la protege contra reevaluaciones HMR; no se usan efectos de montaje para contar vistas, por lo que `StrictMode` y los renders repetidos no las duplican.
- Las necesidades tienen IDs canónicos en `src/data/projects.ts`, añadidos al modelo porque no existían antes. Los eventos usan esos IDs junto con el ID original del proyecto; no fabrican identificadores durante el registro.
- `ProjectDetailPage` muestra el resumen y estado del proyecto, las herramientas, sus solicitudes y un QR generado en tiempo de ejecución con `qrcode.react` (`QRCodeSVG`). El QR apunta a la URL actual con el ID del proyecto; no existe un archivo SVG de QR guardado en el repositorio.
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
- `Need`: nombre, detalle, dedicación, herramienta, descripción, requisitos, entregable y marca opcional `featured`.
- `Tool`: área y detalle.
- `Contact`: tipo (`whatsapp`, `instagram` o `discord`), etiqueta, identificador visible y URL.

`src/data/projects.ts` contiene actualmente a Stewart y Frecuencia Cero. El primer registro conserva deliberadamente el ID estable `ecos-de-umbra` para mantener los enlaces y QR ya emitidos; el siguiente reemplazo del ID requiere una migración explícita para no mezclar analítica ni romper enlaces.

Stewart usa el arte conceptual `public/assets/images/gallery/StewartCard.png`, con una URL formada desde `import.meta.env.BASE_URL` para funcionar también en despliegues bajo una subruta. El GDD describe un ARPG de aventura, fantasía ligera y comedia, con siete reinos inspirados en Colombia, exploración top-down, combate lateral y un sistema de empatía. El equipo activo y el progreso no están confirmados; por eso `team` y `progress` son `null`. Las necesidades y contactos permanecen vacíos hasta que el equipo confirme oportunidades reales.

## Estilos y marca

- El proyecto usa React 19, TypeScript, Vite 8 y Tailwind CSS v4.
- `src/index.css` importa Tailwind y mantiene las fuentes Figma, colores globales y arte decorativo del prototipo.
- `src/constants/styles.ts` exporta tokens TypeScript (`colors`, `typography`, `spacing`, `radii`, `shadows`, `motion`) y las clases compartidas `semi`, `reg`, `instr` y `wdth`. No todos los tokens están conectados actualmente a `index.css`; cambios de marca pueden requerir actualizar ambos y las clases Tailwind literales.
- Las páginas y componentes todavía tienen valores Tailwind literales, por ejemplo `text-[#...]` y `rounded-[...]`. Cambiar un token no modifica automáticamente esos literales; migrarlos si se requiere consistencia global.
- Las fuentes se descargan desde Google Fonts, por lo que su carga depende de conexión externa.

## Configuración y herramientas

- `vite.config.ts` configura React, Tailwind v4, plugins de Figma Make, el alias `@` hacia `src`, y el servidor de desarrollo. El puerto predeterminado es `8443`, configurable con `PORT`.
- `.figma/make/site.json` configura metadatos de Figma Make, incluyendo descripción y directivas de indexación. El título visible actual está escrito directamente en `index.html`.
- `tsconfig.json` activa TypeScript estricto y mapea `@/*` a `src/*`.
- `.mise.toml` declara Node 22 y pnpm 10.34.3.

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

## Mantenimiento de este documento

Actualizar esta guía en la misma tarea que cualquier cambio de código, estructura, configuración, dependencia o comportamiento. Mantener el árbol, los flujos, las fuentes de verdad y los comandos fieles al estado actual. No agregar un changelog: documentar cómo funciona hoy el proyecto.
