# Contexto del proyecto

## Propósito

Aplicación web para explorar proyectos de videojuegos, revisar su avance y sus solicitudes de colaboración, y acceder a los canales de contacto de cada equipo. Es un prototipo frontend: el catálogo es local y los datos analíticos se guardan solo en memoria por defecto. No hay backend de analítica ni persistencia global de solicitudes o eventos.

## Recorrido de ejecución

1. `index.html` define el documento, el título actual de pestaña (`Proyectos abiertos | MADV`) y carga `src/main.tsx` dentro de `#root`.
2. `src/main.tsx` importa los estilos globales y monta React.
3. `src/App.tsx` es una fachada que reexporta `src/app/App.tsx`.
4. `src/app/App.tsx` decide qué vista mostrar. La landing se importa directamente; galería, eventos, repositorio, preguntas y detalles se cargan bajo demanda con `React.lazy` y `Suspense`.
5. `src/data/projects.ts` proporciona los datos que consumen las vistas y componentes.
6. `src/component/StaggeredMenu.tsx` presenta la navegación global fija y el enlace de Instagram de GDD en todas las vistas.

## Estructura

```text
.
├── index.html                    # Shell HTML y título de la pestaña
├── package.json                  # Scripts y dependencias del proyecto
├── pnpm-lock.yaml                # Versiones fijadas por pnpm
├── .env.example                  # Variables de ejemplo para analítica local/API
├── tsconfig.json                 # Configuración TypeScript y alias @/*
├── vite.config.ts                # Vite, React, Tailwind, Figma Make, alias, registro de visitas en dev y manualChunks (react/gsap en chunks aparte)
├── vitest.config.ts              # Alias y configuración de pruebas
├── .mise.toml                    # Versiones de Node y pnpm
├── .gitignore                    # Excluye dependencias, builds, secretos y estado local
├── AGENTS.md                     # Instrucciones de trabajo para agentes
├── CLAUDE.md                     # Reutiliza AGENTS.md
├── PROJECT_CONTEXT.md            # Este mapa de contexto mantenido
├── plantilla_proyecto_repositorio.xlsx # Plantilla vacía para incorporar nuevos proyectos
├── dist/                         # Salida de `pnpm build` (generada, no versionada)
├── public/
│   └── assets/
│       ├── branding/
│       │   ├── LogoMADV.svg      # Logo de la landing
│       │   └── qr-landing-madv.svg # QR estático de la URL pública de la landing
│       ├── gallery/              # 14 láminas .svg del recorrido visual:
│       │                         # Titulo, Contexto1, Contexto2, Objetivos,
│       │                         # Problemas, Metodologia, Testeos y desarrollo,
│       │                         # Propuesta, Roadmap, Usuario, Entornos,
│       │                         # EntornoEsp, ArbolProb, ArbustoProb
│       └── projects/             # Arte conceptual de las tarjetas de proyecto
│           ├── StewartCard.svg
│           ├── BTWCard.svg
│           └── BCCCard.svg
└── src/
    ├── main.tsx                  # Montaje de React e importación de CSS
    ├── App.tsx                   # Fachada hacia app/App.tsx
    ├── index.css                 # Tailwind v4, kit de marca y estilos globales
    ├── app/
    │   ├── App.tsx               # Navegación, React.lazy/Suspense e instrumentación
    │   └── App.analytics.test.tsx # Pruebas DOM; espera la resolución de vistas lazy
    ├── config/
    │   ├── environment.ts        # Selección segura del modo de analítica
    │   └── environment.test.ts   # Pruebas de configuración y valores por defecto
    ├── components/
    │   ├── dimaac/
    │   │   └── social-card.tsx  # SocialCard de DiMaac UI (registro shadcn; único cambio: prop showLikes); usa gsap y @gsap/react. Actualmente no se usa en ninguna vista
    │   ├── instagram/
    │   │   └── InstagramPostCard.tsx # Embed oficial (iframe) del post de Instagram configurado y enlace al post
    │   ├── common/
    │   │   ├── AngleIcon.tsx       # Chevrón angular reutilizable para navegación y botones
    │   │   ├── ArtPlaceholder.tsx # Arte conceptual decorativo con color por proyecto
    │   │   ├── PageLoading.tsx    # Indicador accesible durante imports React.lazy
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
    │   ├── CurvedLoop.tsx         # Texto curvo animado del hero de la landing
    │   ├── CurvedLoop.css         # Dimensiones y comportamiento visual del texto curvo
    │   └── DepthCarousel.tsx      # Carrusel de profundidad reutilizado en la galería
    │   └── ScrambledText.tsx     # Texto scramble: entrada automatica + reaccion solo a click/tap (hover desactivado, pensado para movil)
    │   └── ScrollReveal.tsx      # Revelado de texto palabra a palabra: modo `scrub` calculado localmente con la posición en pantalla (sin ScrollTrigger); modo `enter` con GSAP ScrollTrigger. Prop `as` elige la etiqueta (h2 por defecto). Estilos en ScrollReveal.css
    ├── constants/
    │   └── styles.ts             # Tokens TypeScript y clases tipográficas comunes
    ├── services/
    │   └── analytics/
    │       ├── analytics.types.ts # Eventos, contratos y validador
    │       ├── analytics.service.ts # Fachada, selección y manejo de fallos
    │       ├── local.adapter.ts   # Buffer de memoria inspeccionable
    │       ├── api.adapter.ts     # POST HTTP sin credenciales ni reintentos
    │       ├── visits-report.ts   # Lectura de .data/visits.jsonl, conteos y HTML del dashboard
    │       └── *.test.ts          # Validación y pruebas de adaptadores
    ├── data/
    │   └── projects.ts           # Catálogo local de proyectos y contenido asociado
    ├── pages/
    │   ├── LandingPage.tsx      # Portada y resumen de MADV
    │       ├── GalleryPage.tsx      # Carrusel de 14 imágenes, descripciones y visor 16:9
    │   ├── EventsPage.tsx       # Página "Eventos": lugar de GDD, siguiente evento y post real de Instagram
    │   ├── FaqPage.tsx          # Página de preguntas frecuentes (?vista=faq), solo accesible desde el menú
    │   ├── RepositoryPage.tsx    # Listado de proyectos
    │   ├── ProjectDetailPage.tsx # Detalle, avance, QR, herramientas y necesidades
    │   └── NeedDetailPage.tsx    # Detalle de una necesidad y contactos
    ├── types/
    │   └── project.ts            # Tipos Project, Need, Tool, Contact y secciones de detalle
    └── utils/
        └── scroll.ts             # Desplazamiento al inicio al navegar
```

## Navegación y vistas

- `RepositoryPage` recorre `projects` y presenta una tarjeta por proyecto; cada tarjeta completa abre los detalles del proyecto y su botón de colaboración conserva el registro de clic. `ProjectCard` muestra las herramientas y las etiquetas con sus respectivos rótulos. Su identidad visual usa verdes eléctricos para diferenciar el catálogo de proyectos de la identidad amarilla de MADV. El encabezado comunica que son proyectos abiertos a colaboración (“Encuentra dónde aportar”) sin cambiar la navegación. “Volver a MADV” regresa a la portada y elimina `vista=repository` de la URL.
- La raíz (`/`) muestra `LandingPage`; su logo principal es decorativo y no funciona como enlace. El CTA “Repositorio abierto” navega a `?vista=repository`; “Saber más del proyecto” abre `?vista=gallery` y “Eventos” abre `?vista=events`. El bloque sobre la colaboración del GDD usa jerarquía editorial con una introducción semibold en cursiva y un segundo párrafo regular justificado. Ambos párrafos usan `ScrambledText` (efecto `lift`, con `clickBurst`) y reciben su tipografía por `className`; `@components/ScrambledText.css` no define margen, fuente ni tamaño para no anular las utilidades de Tailwind.
- El hero de `LandingPage` presenta “Conectémonos para crear” y “entre tod@s.” centrados, con `CurvedLoop` como carrusel curvo animado e interactivo (se puede arrastrar horizontalmente) de los temas “momentos”, “proyectos”, “experiencias”, “juegos”, “comunidad”, “amigos” y “conocimientos”.
- La landing termina con una llamada a la acción oscura para colaboración. El encabezado de esta sección usa `ScrambledText` con efecto `lift` y el botón “Colaborar en un proyecto” reutiliza `onOpenRepository` para dirigir al repositorio.
- Antes de la llamada a la acción final, la landing muestra un encabezado visible y un contador 2×2 compacto con 26 proyectos terminados, 3 en curso, 49 publicados y 25 de jams, basado en el perfil de GDD en itch.io. El enlace “Ver todos los proyectos” abre `https://gdd-col.itch.io/` en una pestaña nueva.
- `EventsPage` (`?vista=events`) muestra el título “Eventos” en tamaño grande y un bloque con “¿Y en dónde puedo asistir a GDD?”, “Lugar: El salón nº 304 - CYT” y el encabezado “El siguiente evento es:”. Debajo, centrado, `InstagramPostCard` incrusta el embed oficial de Instagram del post configurado en `src/data/instagram-post.ts` (hasta 400 px de ancho) y un botón oscuro de ancho completo “Ver publicación en Instagram” que abre el post en otra pestaña (ver “Publicación real de Instagram”). Si no hay enlace configurado, no se muestra nada. La flecha global regresa a la landing y elimina `vista` de la URL. La barra usa el fondo crema `#f6f3ea`. La vista no registra eventos de analítica. En `App.analytics.test.tsx`, `vi.mock("@/data/instagram-post")` provee un enlace de ejemplo.
- `FaqPage` (`?vista=faq`) contiene las preguntas frecuentes con desplegables nativos (`details`/`summary`) sobre el fondo amarillo `#f0cb82`. Las preguntas viven en el arreglo `faqs` de `src/pages/FaqPage.tsx`. La landing no la enlaza; solo se llega desde el menú lateral (“Preguntas”) o por URL directa. La flecha global regresa a la landing y elimina `vista`. La vista no registra eventos de analítica.
- `StaggeredMenu` ocupa el encabezado superior de todas las vistas y enlaza a Inicio, Proyectos, Sobre MADV, Eventos y Preguntas; el botón se desplaza con el contenido en lugar de permanecer fijo durante el scroll. También ofrece Instagram y Discord de GDD en la sección “Redes”; únicamente estos enlaces muestran el indicador visual `◥`.
- `App` compone una barra de navegación global única: la flecha accesible de regreso queda a la izquierda y `StaggeredMenu` a la derecha. Las vistas secundarias no renderizan barras o controles superiores duplicados.
- La barra global recibe `headerColor` y `backButtonColor` según la vista activa para igualar el color de la sección inferior y mantener el contraste de “Menu +” y la flecha.
- `GalleryPage` presenta las 14 láminas SVG desde `public/assets/gallery/` mediante `DepthCarousel`, con un fondo crema detrás de las imágenes para conservar correctamente los colores de las capas semitransparentes. Todas las láminas conservan el texto convertido a trazados y no dependen de fuentes externas. La descripción inferior cambia con la lámina activa y al tocar una tarjeta se abre el visor 16:9 a pantalla completa, con navegación, cierre y soporte de teclado; el fallback solo aparece después de un error real de carga.
- La landing presenta una introducción de MADV y una lista breve de los proyectos existentes; las preguntas frecuentes están en `FaqPage`. Los contadores de proyectos y oportunidades se muestran en `RepositoryPage`, junto con el encabezado del catálogo. No añade proyectos ni modifica el catálogo.
- Después de la sección de `ScrollExpand`, un divisor (`hr` decorativo de 8 px color `oro`) la separa de la sección `#sobre-madv`, que contiene solo el texto “Qué implica el proyecto…”. Esa sección revela con `ScrollReveal` (efecto `fade` con desenfoque, ligado al scroll, opacidad inicial 0,15) el título “Un punto de encuentro para crear en comunidad.” (`h2`, con leve giro inicial) y el párrafo descriptivo (`p`, sin giro). Ambos empiezan a revelarse cuando su borde superior está a un 20 % de su alto por encima del borde inferior de la ventana y terminan cuando llega al 35 % de la ventana (`wordAnimationEnd="top 35%"`). En el modo de scroll (`mode="scrub"`, el usado aquí), `ScrollReveal` no usa ScrollTrigger: en cada evento de scroll lee la posición actual del texto con `getBoundingClientRect()` y calcula el avance, así que no guarda posiciones, no le afecta que `ScrollExpand` cambie su altura y no refresca otras animaciones de la página. El texto se renderiza una sola vez (las palabras van en `span`, sin copia oculta). Con `prefers-reduced-motion: reduce` el texto se sigue revelando solo con opacidad (sin desenfoque, giro ni desplazamiento); sin `matchMedia` (jsdom) se muestra estático. Una sección aparte, separada por un borde superior, contiene el `HalftoneReveal` interactivo con `ColabLogo.jpg` y un subtítulo sobre el crecimiento de la comunidad.
- `LandingPopup` fue eliminado por no estar montado ni referenciado en ninguna parte del código.
- La navegación entre landing, galería, eventos, repositorio, proyectos y necesidades cambia las vistas de forma instantánea, sin swipe ni slide horizontal.
- `LandingPage` incluye `ScrollExpand` con `LogoMADV.jpg` como recurso visual. La animación usa el scroll de la ventana para expandir el marco, revelar el contenido y mantener la navegación existente sin dependencias externas.
- Los recursos visuales se organizan en `public/assets/branding/`, `public/assets/gallery/` y `public/assets/projects/`. Se referencian desde la web anteponiendo `import.meta.env.BASE_URL` a `assets/<grupo>/<archivo>` para respetar la base de despliegue. El logo de MADV se encuentra en `public/assets/branding/LogoMADV.svg` y `LogoMADV.jpg`; `public/assets/branding/qr-landing-madv.svg` contiene el QR estático de `https://prototipo-de-app-de-proyectos.vercel.app/`, sin incorporarse a la interfaz; las 12 láminas están en `gallery/` y el arte de tarjetas en `projects/`. Los archivos conservan sus nombres originales.
- `repository_view` se registra al entrar al listado, no al visitar la landing. `trackCurrentPageView` distingue el listado mediante `vista=repository`.
- Al seleccionar un proyecto, `app/App.tsx` actualiza el estado y agrega su ID a la query string: `?proyecto=<id>`.
- `proyecto=<id>` tiene prioridad sobre `vista`; por ello los enlaces directos y QR existentes continúan abriendo la ficha del proyecto.
- Al cargar la app, ese parámetro se resuelve contra `projects`; así los enlaces compartidos y los QR abren el detalle correspondiente. `popstate` sincroniza la vista cuando se navega atrás/adelante.
- El botón de regreso al repositorio elimina el parámetro `proyecto`.
- La analítica considera nueva vista el arranque de un documento, una apertura explícita de página por navegación o una transición `popstate`. `main.tsx` registra la vista inicial fuera de React y la protege contra reevaluaciones HMR; no se usan efectos de montaje para contar vistas, por lo que `StrictMode` y los renders repetidos no las duplican.
- Las necesidades tienen IDs canónicos en `src/data/projects.ts`, añadidos al modelo porque no existían antes. Los eventos usan esos IDs junto con el ID original del proyecto; no fabrican identificadores durante el registro.
- `ProjectDetailPage` muestra el resumen y estado del proyecto, las herramientas, sus solicitudes y un QR generado en tiempo de ejecución con `qrcode.react` (`QRCodeSVG`). El QR apunta a la URL del proyecto y ofrece compartirlo como imagen mediante Web Share API cuando el navegador lo permite, o descargarlo como PNG.
- `ProjectCard` y `ProjectDetailPage` muestran el arte opcional `Project.artImage`; si el equipo/progreso no está confirmado, `team` y `progress` aceptan `null` y la interfaz muestra “por confirmar” sin dibujar porcentajes ficticios.
- `fuerza-paranormal` corresponde a “Luchador contra lo Oculto”, documentado en la matriz de Fuerza Paranormal. El catálogo registra un avance del 10%, etapa de producción, 3 integrantes, Unity/Blender/Google Drive/LMMS y un alcance de acción paranormal en PC; el proyecto no documenta solicitudes de colaboración, por lo que `needs`/`contacts` permanecen vacíos.
- `plantilla_proyecto_repositorio.xlsx` es la plantilla de carga manual para nuevos proyectos. Sus hojas separan los datos generales, herramientas, etiquetas, necesidades, requisitos, entregables y contactos; las filas de datos se dejan vacías para completar cada nuevo proyecto.
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
- `environment.ts` lee `VITE_ANALYTICS_MODE` y `VITE_API_BASE_URL`. El modo predeterminado es `local`. API solo se activa cuando el modo vale `api` y la URL base es HTTP(S), válida y sin credenciales; si falta o es inválida, se usa modo local. La URL base también puede ser una ruta relativa al sitio (`/`), que se resuelve contra el origen actual más `import.meta.env.BASE_URL`; así los eventos van al mismo servidor que sirve la página.
- `.env.example` muestra configuración local y ejemplos comentados para API. `.env.development.local` (ignorado por Git) activa `VITE_ANALYTICS_MODE=api` con `VITE_API_BASE_URL=/` solo en modo desarrollo. Las variables `VITE_*` son públicas y nunca deben contener secretos.
- `local.adapter.ts` conserva eventos en un buffer en memoria de esta pestaña y los muestra en consola de desarrollo. `getEvents()` facilita su inspección; no usa `localStorage`, no sincroniza dispositivos y no representa estadísticas globales. El buffer se pierde al recargar o cerrar la pestaña.
- `api.adapter.ts` envía cada evento con un `POST` a `<VITE_API_BASE_URL>/api/events`, sin autenticación, reintentos ni credenciales. Llama a `fetch` global sin reasignar su `this` (de lo contrario el navegador lanza "Illegal invocation"). Errores HTTP y de conectividad llegan a la fachada, que los maneja sin lanzar excepciones a la interfaz.
- Activar un backend externo: definir `VITE_ANALYTICS_MODE=api` y `VITE_API_BASE_URL=https://<host-configurado>`, sin cambiar los componentes.

## Publicación real de Instagram

- La única configuración es `export const instagramPostUrl = "..."` en `src/data/instagram-post.ts`. Acepta enlaces públicos `https://www.instagram.com/p/<código>/`, `/reel/<código>/`, `/tv/<código>/`, la forma `/<usuario>/p/<código>/` y enlaces con `?igsh=`. Con `""` no se muestra nada; con un enlace inválido no se muestra nada (en desarrollo aparece un aviso).
- `InstagramPostCard` carga en un `iframe` el embed oficial `https://www.instagram.com/<tipo>/<código>/embed/captioned/`. Instagram dibuja la imagen en su proporción real, la descripción y su propio estilo; el proyecto no descarga, procesa ni guarda la imagen ni el texto, y no hay plugin de Vite para Instagram. El navegador del visitante contacta a Instagram al mostrar la página (con `loading="lazy"`), lo que implica las cookies y el rastreo propios de Instagram. Cambiar el enlace se ve al instante, sin recompilar los datos.
- El iframe empieza con 720 px de alto y adopta la altura que el embed anuncia con `postMessage` (`{"type":"MEASURE","details":{"height":N}}`), con tope de 2000 px. Solo se aceptan mensajes con origen `https://www.instagram.com` y cuya fuente es ese mismo iframe. El iframe usa `sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"` y `referrerPolicy="strict-origin-when-cross-origin"`.
- `src/services/instagram/instagram-post.ts` contiene la lógica pura: validación del enlace (`parseInstagramPostUrl`), URL del embed (`instagramEmbedUrl`) y lectura del mensaje de altura (`readEmbedHeight`). Se prueba en `instagram-post.test.tsx` junto con el componente.
- Si el post es privado o fue borrado, el propio embed de Instagram muestra su aviso. El formato del embed y del mensaje de altura los controla Instagram y pueden cambiar sin aviso.

## Registro de visitas en el servidor de Vite

El plugin `visitsDashboardPlugin` de `vite.config.ts` (solo `vite`/dev, `apply: "serve"`) implementa el contrato `POST /api/events` mientras la página se sirve con el servidor de desarrollo:

- `POST <base>api/events`: exige `Content-Type: application/json` (`415`), cuerpo de hasta 4 KB (`413`), JSON válido (`400`) y un evento que pase `isAnalyticsEvent` (`422`). Los eventos aceptados se agregan a `.data/visits.jsonl` con `received_at` (hora del servidor) y responde `202`. Otros métodos reciben `405`.
- `GET <base>dashboard-visitas`: HTML de texto plano (`noindex`, `no-store`) con vistas totales, vistas del listado, vistas por proyecto y por necesidad, clics por evento/destino/proyecto y la fecha del primer y último registro. Ninguna vista de la app lo enlaza.
- El plugin carga `visits-report.ts`, `analytics.types.ts` y `projects.ts` con `server.ssrLoadModule`, de modo que usa el mismo validador y catálogo que el cliente. Las líneas corruptas o que ya no cumplen el contrato se cuentan como descartadas.
- `.data/` está en `.gitignore` y excluido del watcher de Vite. Borrar `.data/visits.jsonl` reinicia los conteos.
- Limitaciones: no hay autenticación (cualquiera con la URL del servidor puede ver el dashboard o enviar eventos válidos), ni límite de tasa, ni visitantes únicos. El build estático (`pnpm build`) no incluye estas rutas; en un despliegue estático los `POST` fallan sin afectar la interfaz.

## Contrato futuro del backend

Este repositorio implementa el cliente HTTP y, solo en el servidor de desarrollo de Vite, un receptor de `POST /api/events` que guarda en archivo (ver la sección anterior). La persistencia compartida en producción, la validación definitiva y las consultas agregadas por API requieren un backend real.

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
- `src/index.css` importa Tailwind y define la paleta MADV mediante `@theme`. Los tokens generan utilidades semánticas como `bg-crema`, `text-tinta`, `bg-lima`, `text-turquesa` y sus variantes de borde, hover y opacidad.
- `:root`, `html`, `body` y `::selection` consumen las mismas variables `--color-*`, por lo que los colores globales y las utilidades comparten una sola fuente.
- `src/constants/styles.ts` exporta las clases tipográficas compartidas `semi`, `reg`, `instr` y `wdth`.
- Las utilidades de color hex arbitrario se migraron a tokens. Los valores hex que permanecen en TypeScript son entradas directas de canvas, props configurables o datos dinámicos; no son clases Tailwind.
- Los tamaños y radios específicos todavía usan valores arbitrarios (`text-[...]`, `rounded-[...]`) cuando el diseño los requiere.
- Las fuentes se descargan desde Google Fonts, por lo que su carga depende de conexión externa.

## Configuración y herramientas

- `vite.config.ts` configura React, Tailwind v4, plugins de Figma Make, el alias `@` hacia `src`, y el servidor de desarrollo. El puerto predeterminado es `8443`, configurable con `PORT`. `base` usa `FIGMA_PUBLIC_URL` cuando existe y `/` en caso contrario. `manualChunks` separa React y GSAP para mejorar caché; `React.lazy` genera además un chunk por vista secundaria. En la compilación validada, el chunk inicial de la aplicación es de aproximadamente 63.8 kB (22.8 kB gzip), frente a los 206 kB (100 kB gzip) previos al lazy-loading.
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
- Rutas: la navegación usa query strings (`?vista=repository`, `?vista=gallery`, `?vista=events`, `?vista=faq`, `?proyecto=<id>`), por lo que no se requiere reescritura de rutas en el host.
- Variables: `VITE_ANALYTICS_MODE` y `VITE_API_BASE_URL` se configuran en el panel del host, nunca en el repositorio. Sin ellas, la analítica queda en modo local.
- `.vercel` está excluido por `.gitignore`; `dist/` y `node_modules/` tampoco se versionan.

## Mantenimiento de este documento

Actualizar esta guía en la misma tarea que cualquier cambio de código, estructura, configuración, dependencia o comportamiento. Mantener el árbol, los flujos, las fuentes de verdad y los comandos fieles al estado actual. No agregar un changelog: documentar cómo funciona hoy el proyecto.
