import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "ecos-de-umbra",
    title: "Stewart",
    shortTitle: "Stewart",
    genre: "ARPG de aventura, fantasía ligera y comedia",
    team: 2,
    progress: 15,
    stage: "Preproducción",
    status:
      "El GDD registra seis personas desarrolladoras; el equipo activo lo conforman dos personas. ",
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
    contacts: [
      {
        type: "instagram",
        label: "Instagram",
        handle: "@gdd_col",
        href: "https://www.instagram.com/gdd_col/",
      },
    ],
    accent: "#dca039",
    artLabel: "STEWART · ARTE CONCEPTUAL",
    artImage: `${import.meta.env.BASE_URL}assets/StewartCard.svg`,
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
        handle: "@gdd_col",
        href: "https://www.instagram.com/gdd_col/",
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
  {
    id: "beat-the-world",
    title: "Beat The World",
    shortTitle: "Beat The World",
    genre: "Plataformas 2D, acción rítmica y música",
    team: 1,
    progress: 15,
    stage: "Prototipado (por confirmar)",
    status:
      "El analizador musical está en desarrollo; el estado actual del prototipo está por confirmar.",
    eyebrow: "Plataformas 2D · acción rítmica",
    summary:
      "Elige una canción y supera pistas sincronizando tus movimientos con la música. Combina plataformas y acción para mejorar tu puntuación, dominar cada recorrido y demostrar tu coordinación.",
    tools: [
      {
        area: "Motor y código",
        detail: "Unity 6000.3.9f1 · C# · Python",
      },
      {
        area: "Arte 2D",
        detail: "Clip Studio Paint",
      },
      {
        area: "Audio",
        detail: "Audacity · FL Studio / LMMS",
      },
    ],
    tags: ["2D", "Plataformas", "Ritmo", "Música", "Acción", "Rejugabilidad"],
    needs: [
      {
        id: "beat-the-world-gameplay",
        name: "Programación de gameplay rítmico",
        detail: "Propuesta inferida · prototipo 2D",
        commitment: "Propuesta · confirmar con el equipo",
        tool: {
          area: "Programación de gameplay",
          detail: "Unity 6000.3.9f1 · C#",
        },
        description:
          "El GDD describe movimiento, salto, dash y sincronización con la música, pero no confirma su estado de implementación ni solicita este perfil. Se propone validar con el equipo si hace falta apoyo para prototipar una mecánica.",
        requirements: [
          "Fundamentos de C# y Unity",
          "Interés en mecánicas de plataformas 2D",
          "Acordar con el equipo qué sistema y alcance abordar",
        ],
        deliverable: {
          name: "Prototipo de mecánica",
          detail: "Escena de prueba con controles y sincronización acordados",
        },
        status: "proposed",
      },
      {
        id: "beat-the-world-audio-analysis",
        name: "Analizador musical e integración",
        detail: "Propuesta inferida · Python y Unity",
        commitment: "Propuesta · confirmar con el equipo",
        tool: {
          area: "Análisis musical",
          detail: "Python · Unity · C#",
        },
        description:
          "La matriz indica que el analizador musical está en desarrollo y que su integración con Unity/C# se evalúa. Se propone validar si el equipo necesita apoyo para probar el intercambio de datos entre ambas partes.",
        requirements: [
          "Experiencia básica con Python",
          "Interés en análisis de audio o señales musicales",
          "Coordinar con el equipo el formato de integración",
        ],
        deliverable: {
          name: "Prueba de integración",
          detail:
            "Experimento documentado de datos musicales entre Python y Unity",
        },
        status: "proposed",
      },
    ],
    contacts: [
      {
        type: "instagram",
        label: "Instagram",
        handle: "@gdd_col",
        href: "https://www.instagram.com/gdd_col/",
      },
    ],
    accent: "#d9533f",
    artLabel: "BEAT THE WORLD · ARTE CONCEPTUAL",
    artImage: `${import.meta.env.BASE_URL}assets/BTWCard.svg`,
  },
  {
    id: "beast-card-clash",
    title: "Beast Card Clash (BCC)",
    shortTitle: "Beast Card Clash",
    genre: "Juego de cartas estratégico por turnos · point-and-click",
    team: 4,
    progress: 30,
    stage: "Desarrollo de demo",
    status:
      "Demo en desarrollo; diálogos en proceso. Necesidades de arte, sonido, programación y organización por confirmar.",
    eyebrow: "Veld Bears · PC Windows",
    summary:
      "Explora Veritas Académica, una universidad de animales inspirada en la UNAL Bogotá. Conoce su historia en escenas point-and-click y reta a bots en duelos estratégicos de cartas por turnos.",
    tools: [
      { area: "Motor y código", detail: "Godot · GDScript" },
      {
        area: "Arte y cartas",
        detail: "Canva · Adobe Illustrator · Dextrous",
      },
      {
        area: "Audio y música",
        detail: "Ableton Live 10 · Finale 2026",
      },
    ],
    tags: [
      "Cartas",
      "Estrategia",
      "Turnos",
      "Point-and-click",
      "Narrativa",
      "UNAL Bogotá",
    ],
    needs: [
      {
        id: "beast-card-clash-digital-art",
        name: "Arte digital para la demo",
        detail: "Rol del GDD · disponibilidad por confirmar",
        commitment: "Propuesta · confirmar con el equipo",
        tool: {
          area: "Ilustración y arte 2D",
          detail: "Adobe Illustrator · Canva",
        },
        description:
          "El GDD menciona artistas digitales para crear o adaptar cartas, escenarios, personajes y otros recursos. Esta propuesta resume ese rol; el equipo debe confirmar si continúa necesitando apoyo y qué entregables están pendientes.",
        requirements: [
          "Interés o experiencia en ilustración digital 2D",
          "Disposición para seguir la dirección visual del proyecto",
          "Acordar con el equipo los assets y el alcance",
        ],
        deliverable: {
          name: "Recurso visual para la demo",
          detail: "Asset acordado para cartas, escenarios o personajes",
        },
        status: "proposed",
      },
      {
        id: "beast-card-clash-godot-programming",
        name: "Programación en Godot",
        detail: "Mecánicas de la demo · vigencia por confirmar",
        commitment: "Propuesta · confirmar con el equipo",
        tool: {
          area: "Programación de videojuegos",
          detail: "Godot · GDScript",
        },
        description:
          "El GDD menciona programadores con fundamentos y disposición para aprender Godot e implementar mecánicas. Se propone validar con el equipo qué parte del tutorial o de la partida necesita apoyo.",
        requirements: [
          "Fundamentos de programación",
          "Interés en aprender Godot y GDScript",
          "Coordinar con el equipo la mecánica y el alcance",
        ],
        deliverable: {
          name: "Mecánica acordada",
          detail: "Implementación de prueba para la demo",
        },
        status: "proposed",
      },
    ],
    contacts: [
      {
        type: "instagram",
        label: "Instagram",
        handle: "@gdd_col",
        href: "https://www.instagram.com/gdd_col/",
      },
    ],
    accent: "#59836f",
    artLabel: "BEAST CARD CLASH · VELD BEARS",
    artImage: `${import.meta.env.BASE_URL}assets/BCCCard.svg`,
  },
]
