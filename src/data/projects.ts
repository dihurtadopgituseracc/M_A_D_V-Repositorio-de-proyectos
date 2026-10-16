import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "ecos-de-umbra",
    title: "Stewart",
    shortTitle: "Stewart",
    genre: "ARPG de aventura, fantasía ligera y comedia",
    team: null,
    progress: null,
    stage: "Por confirmar",
    status:
      "El GDD registra seis personas desarrolladoras y cuatro contribuyentes retirados; el equipo activo está por confirmar. El documento sigue en evolución y la investigación de mercado figura como pendiente.",
    eyebrow: "Fantasía inspirada en Colombia",
    summary:
      "Acompaña a Stewart y Zarah por siete reinos inspirados en regiones de Colombia y en las épocas independentista y republicana. Explora desde una vista top-down y combate en escenarios laterales. La empatía permite intentar resolver los conflictos con acciones pacíficas como hablar o halagar.",
    tools: [
      { area: "Motor", detail: "Godot · GDScript" },
      { area: "Arte", detail: "Aseprite · Krita" },
      { area: "Audio", detail: "FL Studio" },
    ],
    tags: ["Pixel art", "Exploración", "Combate", "Narrativa", "Fantasía"],
    needs: [],
    contacts: [],
    accent: "#dca039",
    artLabel: "STEWART · ARTE CONCEPTUAL",
    artImage: `${import.meta.env.BASE_URL}assets/StewartCard.png`,
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
