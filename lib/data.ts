export const DEMO_USER = {
  name: "María González",
  email: "demo@filar6.com",
  diagnosis: "Fibromialgia",
  activeWeek: 2,
  startDate: "2026-04-28",
};

export const BADGES = [
  {
    key: "week_1_done",
    name: "Primera semana",
    description: "Completaste todos los videos de la semana 1",
    emoji: "🏅",
    earned: true,
  },
  {
    key: "streak_7",
    name: "7 días seguidos",
    description: "Registraste tu bienestar 7 días consecutivos",
    emoji: "🔥",
    earned: true,
  },
  {
    key: "cocina",
    name: "Cocinero saludable",
    description: "Completaste un video de cocina",
    emoji: "👩‍🍳",
    earned: false,
  },
  {
    key: "warrior",
    name: "Guerrero del movimiento",
    description: "Completaste 10 videos de ejercicio",
    emoji: "💪",
    earned: false,
  },
  {
    key: "graduate",
    name: "Programa completo",
    description: "Finalizaste las 6 semanas de FILAR‑6",
    emoji: "🦋",
    earned: false,
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  EJERCICIO: "Ejercicio",
  NUTRICION: "Nutrición",
  COCINA: "Cocina",
  BIENESTAR: "Bienestar",
  EDUCACION: "Educación",
};

export const CATEGORY_COLORS: Record<string, string> = {
  EJERCICIO: "bg-teal/10 text-teal-dark",
  NUTRICION: "bg-gold/20 text-navy",
  COCINA: "bg-coral/10 text-coral",
  BIENESTAR: "bg-teal-light/20 text-teal-dark",
  EDUCACION: "bg-navy/10 text-navy",
};

export const VIDEOS = [
  {
    id: "v1",
    title: "Introducción al movimiento consciente",
    description:
      "Aprende a moverte con intención para reducir el dolor articular. Ejercicios de bajo impacto para Fibromialgia y Artritis.",
    week: 1,
    category: "EJERCICIO",
    specialist: "Dra. Carmen Vega",
    duration: 1200,
    completed: true,
    secondsWatched: 1200,
  },
  {
    id: "v2",
    title: "Respiración y relajación profunda",
    description:
      "Técnicas de respiración diafragmática para reducir la tensión muscular y la percepción del dolor.",
    week: 1,
    category: "BIENESTAR",
    specialist: "Psic. Roberto Flores",
    duration: 900,
    completed: true,
    secondsWatched: 900,
  },
  {
    id: "v3",
    title: "Alimentación antiinflamatoria: bases",
    description:
      "Descubre qué alimentos reducen la inflamación crónica y cómo incorporarlos en tu día a día sin complicaciones.",
    week: 2,
    category: "NUTRICION",
    specialist: "Lic. Ana Torres",
    duration: 1500,
    completed: false,
    secondsWatched: 680,
  },
  {
    id: "v4",
    title: "Ejercicios para manos y muñecas",
    description:
      "Movimientos suaves y progresivos para mantener la flexibilidad y reducir la rigidez matutina.",
    week: 2,
    category: "EJERCICIO",
    specialist: "Dra. Carmen Vega",
    duration: 1080,
    completed: false,
    secondsWatched: 0,
  },
  {
    id: "v5",
    title: "Cocina fácil: sopas reconfortantes",
    description:
      "Recetas de sopas antiinflamatorias que puedes preparar en 20 minutos, adaptadas para personas con movilidad reducida.",
    week: 3,
    category: "COCINA",
    specialist: "Chef Laura Méndez",
    duration: 1800,
    completed: false,
    secondsWatched: 0,
  },
  {
    id: "v6",
    title: "Manejo del estrés y dolor crónico",
    description:
      "Técnicas de mindfulness específicas para pacientes con enfermedades reumáticas.",
    week: 4,
    category: "BIENESTAR",
    specialist: "Psic. Roberto Flores",
    duration: 1350,
    completed: false,
    secondsWatched: 0,
  },
  {
    id: "v7",
    title: "Entendiendo el Lupus: lo que debes saber",
    description:
      "El Dr. Mora explica qué es el Lupus, cómo afecta el cuerpo y qué esperar en el seguimiento médico.",
    week: 5,
    category: "EDUCACION",
    specialist: "Dr. Luis Mora",
    duration: 1680,
    completed: false,
    secondsWatched: 0,
  },
  {
    id: "v8",
    title: "Celebrando tu progreso: semana final",
    description:
      "Un repaso de todo lo aprendido y herramientas para mantener los hábitos adquiridos.",
    week: 6,
    category: "BIENESTAR",
    specialist: "Dra. Carmen Vega",
    duration: 1260,
    completed: false,
    secondsWatched: 0,
  },
];

export const WELLNESS_LOGS = [
  { date: "2026-05-19", painLevel: 4, energy: 6, notes: "Hoy me sentí con más energía" },
  { date: "2026-05-18", painLevel: 5, energy: 5, notes: null },
  { date: "2026-05-17", painLevel: 6, energy: 4, notes: "Día más difícil de lo usual" },
  { date: "2026-05-16", painLevel: 4, energy: 5, notes: null },
  { date: "2026-05-15", painLevel: 3, energy: 7, notes: "¡Muy bien! Caminé 20 minutos" },
  { date: "2026-05-14", painLevel: 5, energy: 5, notes: null },
  { date: "2026-05-13", painLevel: 6, energy: 4, notes: null },
  { date: "2026-05-12", painLevel: 7, energy: 3, notes: "Mucho dolor en las manos" },
  { date: "2026-05-11", painLevel: 5, energy: 5, notes: null },
  { date: "2026-05-10", painLevel: 4, energy: 6, notes: "Ejercicios del programa ayudaron" },
];
