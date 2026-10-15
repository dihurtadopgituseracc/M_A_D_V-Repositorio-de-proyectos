import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "ecos-de-umbra",
    title: "Ecos de Umbra",
    shortTitle: "Ecos de Umbra",
    genre: "RPG narrativo",
    team: 4,
    progress: 62,
    stage: "Producción",
    status: "Prototipo jugable + arte en integración",
    eyebrow: "Aventura narrativa cooperativa",
    summary:
      "Una expedición atraviesa un archipiélago cubierto por una niebla que conserva los recuerdos de sus habitantes. Cada decisión altera las relaciones del grupo, abre nuevas rutas y transforma el desenlace. El prototipo ya incluye exploración, diálogos ramificados y el primer encuentro cooperativo.",
    tools: [
      { area: "Programación", detail: "C# · Unity · Ink" },
      { area: "Arte", detail: "Aseprite · Photoshop" },
      { area: "Sonido", detail: "Audacity · FMOD" },
    ],
    tags: ["Acción", "RPG", "Cooperativo"],
    needs: [
      {
        id: "ecos-audio",
        name: "Audio",
        detail: "Diseño de SFX para el prototipo",
        commitment: "2 sesiones",
        tool: { area: "Audio", detail: "FMOD · Audacity" },
        description:
          "Buscamos definir la identidad sonora del primer recorrido por Umbra. La colaboración contempla efectos ambientales, señales de interacción y una primera mezcla para el encuentro cooperativo.",
        requirements: [
          "Experiencia creando SFX para videojuegos",
          "Capacidad para entregar stems organizados",
          "Disponibilidad para dos sesiones de revisión",
        ],
        deliverable: {
          name: "Paquete de audio",
          detail: "12 SFX editables · WAV 48 kHz",
        },
        featured: true,
      },
      {
        id: "ecos-arte-2d",
        name: "Arte 2D",
        detail: "Cuatro assets para la interfaz",
        commitment: "2–3 sesiones",
        tool: { area: "Ilustración 2D", detail: "Aseprite · Photoshop" },
        description:
          "Necesitamos completar el lenguaje visual del inventario con cuatro piezas que mantengan la estética orgánica y brumosa del proyecto.",
        requirements: [
          "Dominio de ilustración digital o pixel art",
          "Trabajo por capas y archivo fuente editable",
          "Adaptación a una guía visual existente",
        ],
        deliverable: {
          name: "Assets de interfaz",
          detail: "4 piezas · PNG y archivo fuente",
        },
        featured: true,
      },
      {
        id: "ecos-programacion-inventario",
        name: "Programación",
        detail: "Integración del inventario",
        commitment: "PUNTUAL",
        tool: { area: "Programación", detail: "C# · Unity" },
        description:
          "La interfaz visual del inventario ya está diseñada. Hace falta conectar el sistema de datos, los estados de selección y la persistencia entre escenas.",
        requirements: [
          "Experiencia con UI Toolkit o Canvas de Unity",
          "Manejo de ScriptableObjects",
          "Código documentado y desacoplado",
        ],
        deliverable: {
          name: "Módulo funcional",
          detail: "Scripts C# · escena de demostración",
        },
      },
      {
        id: "ecos-narrativa-dialogos",
        name: "Narrativa",
        detail: "Revisión de diálogos del capítulo uno",
        commitment: "PUNTUAL",
        tool: { area: "Narrativa", detail: "Ink · Google Docs" },
        description:
          "Queremos revisar ritmo, claridad y consistencia de voz en las conversaciones del primer capítulo antes de la siguiente ronda de pruebas.",
        requirements: [
          "Experiencia en narrativa interactiva",
          "Criterio de edición y continuidad",
          "Conocimiento básico de estructuras ramificadas",
        ],
        deliverable: {
          name: "Documento comentado",
          detail: "Guion revisado · informe breve",
        },
      },
    ],
    contacts: [
      {
        type: "whatsapp",
        label: "WhatsApp",
        handle: "Equipo Umbra",
        href: "https://wa.me/?text=Hola%2C%20quiero%20colaborar%20con%20Ecos%20de%20Umbra",
      },
      {
        type: "instagram",
        label: "Instagram",
        handle: "@ecosdeumbra.game",
        href: "https://instagram.com/ecosdeumbra.game",
      },
      {
        type: "discord",
        label: "Discord",
        handle: "Ecos de Umbra",
        href: "https://discord.com/",
      },
    ],
    accent: "#287b86",
    artLabel: "MUNDO NARRATIVO / ARTE CONCEPTUAL",
  },
  {
    id: "frecuencia-cero",
    title: "Frecuencia Cero",
    shortTitle: "Frecuencia Cero",
    genre: "Terror en primera persona",
    team: 3,
    progress: 38,
    stage: "Prototipado",
    status: "Bucle principal en validación",
    eyebrow: "Terror psicológico de exploración",
    summary:
      "Atrapada en una estación de radio abandonada, una operadora debe reconstruir una transmisión imposible antes del amanecer. El sonido guía la exploración y también atrae aquello que recorre los pasillos. El equipo está validando el sistema de frecuencias, sigilo y eventos dinámicos.",
    tools: [
      { area: "Programación", detail: "GDScript · Godot 4" },
      { area: "Arte 3D", detail: "Blender · Substance 3D" },
      { area: "Sonido", detail: "Reaper · FMOD" },
    ],
    tags: ["Terror", "Primera persona", "Puzzle"],
    needs: [
      {
        id: "frecuencia-diseno-sonoro",
        name: "Diseño sonoro",
        detail: "Paisaje sonoro de la estación",
        commitment: "3 sesiones",
        tool: { area: "Diseño sonoro", detail: "Reaper · FMOD" },
        description:
          "La estación necesita un paisaje sonoro reactivo que comunique peligro sin depender de indicadores visuales. Se trabajarán capas ambientales, interferencias y eventos direccionales.",
        requirements: [
          "Experiencia con audio espacial",
          "Conocimiento de middleware de audio",
          "Interés por el terror psicológico",
        ],
        deliverable: {
          name: "Escena sonora",
          detail: "Sesión FMOD · stems y mezcla",
        },
        featured: true,
      },
      {
        id: "frecuencia-arte-3d",
        name: "Arte 3D",
        detail: "Props modulares para cabina",
        commitment: "2–4 sesiones",
        tool: { area: "Modelado 3D", detail: "Blender · Substance 3D" },
        description:
          "Buscamos ampliar la cabina de transmisión con objetos modulares que ayuden a narrar el abandono del lugar sin comprometer el rendimiento.",
        requirements: [
          "Modelado low poly y UV",
          "Texturas PBR optimizadas",
          "Exportación compatible con Godot 4",
        ],
        deliverable: {
          name: "Kit modular",
          detail: "6 props · GLB y texturas 2K",
        },
        featured: true,
      },
      {
        id: "frecuencia-programacion-eventos",
        name: "Programación",
        detail: "Sistema de eventos por frecuencia",
        commitment: "PUNTUAL",
        tool: { area: "Programación", detail: "GDScript · Godot 4" },
        description:
          "Se solicita implementar un sistema que active eventos aleatorios y modifique su probabilidad según variables como la vida, el tiempo de exploración y el nivel de señal.",
        requirements: [
          "Experiencia con señales y recursos en Godot 4",
          "Diseño de sistemas ponderados y reproducibles",
          "Pruebas básicas y código documentado",
        ],
        deliverable: {
          name: "Sistema de eventos",
          detail: "GDScript · escena de prueba",
        },
      },
      {
        id: "frecuencia-testing",
        name: "Testing",
        detail: "Prueba de tensión y navegación",
        commitment: "1 sesión",
        tool: { area: "Pruebas de juego", detail: "Godot 4 · Formulario" },
        description:
          "Necesitamos observar cómo una persona nueva interpreta las señales de audio, recorre la estación y responde a los primeros eventos de tensión.",
        requirements: [
          "Jugar con auriculares durante 45 minutos",
          "Grabar pantalla y voz durante la sesión",
          "Completar un formulario de retroalimentación",
        ],
        deliverable: {
          name: "Reporte de prueba",
          detail: "Video de sesión · formulario",
        },
      },
    ],
    contacts: [
      {
        type: "whatsapp",
        label: "WhatsApp",
        handle: "Producción Frecuencia Cero",
        href: "https://wa.me/?text=Hola%2C%20quiero%20colaborar%20con%20Frecuencia%20Cero",
      },
      {
        type: "instagram",
        label: "Instagram",
        handle: "@frecuenciacero.game",
        href: "https://instagram.com/frecuenciacero.game",
      },
      {
        type: "discord",
        label: "Discord",
        handle: "Frecuencia Cero",
        href: "https://discord.com/",
      },
    ],
    accent: "#31556f",
    artLabel: "ESTACIÓN / ARTE DE ATMÓSFERA",
  },
]
