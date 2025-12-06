// src/app/services/translation/dictionary.service.ts

// Diccionario extenso de términos comunes en búsquedas de trabajos
const translationDictionary: { [key: string]: { en: string; es: string } } = {
  // Profesiones/Oficios - TODOS en minúscula
  electricista: { en: 'electrician', es: 'electricista' },
  electrician: { en: 'electrician', es: 'electricista' }, // ⭐ INVERSA
  plomero: { en: 'plumber', es: 'plomero' },
  plomeros: { en: 'plumbers', es: 'plomeros' },
  plumber: { en: 'plumber', es: 'plomero' }, // ⭐ INVERSA
  plumbers: { en: 'plumbers', es: 'plomeros' },
  fontanero: { en: 'plumber', es: 'fontanero' },
  gasfitero: { en: 'plumber', es: 'gasfitero' },
  plomeria: { en: 'plumbing', es: 'plomeria' },
  plumbing: { en: 'plumbing', es: 'plomeria' }, // ⭐ INVERSA
  carpintero: { en: 'carpenter', es: 'carpintero' },
  carpenter: { en: 'carpenter', es: 'carpintero' }, // ⭐ INVERSA
  carpintería: { en: 'carpentry', es: 'carpintería' },
  carpentry: { en: 'carpentry', es: 'carpintería' }, // ⭐ INVERSA
  especializado: { en: 'specialized', es: 'especializado' },
  specialized: { en: 'specialized', es: 'especializado' }, // ⭐ INVERSA
  pintor: { en: 'painter', es: 'pintor' },
  painter: { en: 'painter', es: 'pintor' }, // ⭐ INVERSA
  albañil: { en: 'mason', es: 'albañil' },
  mason: { en: 'mason', es: 'albañil' }, // ⭐ INVERSA
  jardinero: { en: 'gardener', es: 'jardinero' },
  gardener: { en: 'gardener', es: 'jardinero' }, // ⭐ INVERSA
  mecánico: { en: 'mechanic', es: 'mecánico' },
  mechanic: { en: 'mechanic', es: 'mecánico' }, // ⭐ INVERSA
  cerrajero: { en: 'locksmith', es: 'cerrajero' },
  locksmith: { en: 'locksmith', es: 'cerrajero' }, // ⭐ INVERSA
  técnico: { en: 'technician', es: 'técnico' },
  technician: { en: 'technician', es: 'técnico' }, // ⭐ INVERSA
  reparación: { en: 'repair', es: 'reparación' },
  repair: { en: 'repair', es: 'reparación' }, // ⭐ INVERSA
  instalación: { en: 'installation', es: 'instalación' },
  installation: { en: 'installation', es: 'instalación' }, // ⭐ INVERSA
  mantenimiento: { en: 'maintenance', es: 'mantenimiento' },
  maintenance: { en: 'maintenance', es: 'mantenimiento' }, // ⭐ INVERSA

  // Electrodomésticos y tecnología
  electrodomésticos: { en: 'appliances', es: 'electrodomésticos' },
  appliances: { en: 'appliances', es: 'electrodomésticos' }, // ⭐ INVERSA
  refrigerador: { en: 'refrigerator', es: 'refrigerador' },
  refrigerator: { en: 'refrigerator', es: 'refrigerador' }, // ⭐ INVERSA
  lavadora: { en: 'washing machine', es: 'lavadora' },
  'washing machine': { en: 'washing machine', es: 'lavadora' }, // ⭐ INVERSA
  secadora: { en: 'dryer', es: 'secadora' },
  dryer: { en: 'dryer', es: 'secadora' }, // ⭐ INVERSA
  televisor: { en: 'television', es: 'televisor' },
  television: { en: 'television', es: 'televisor' }, // ⭐ INVERSA
  computadora: { en: 'computer', es: 'computadora' },
  computer: { en: 'computer', es: 'computadora' }, // ⭐ INVERSA
  celular: { en: 'cell phone', es: 'celular' },
  'cell phone': { en: 'cell phone', es: 'celular' }, // ⭐ INVERSA
  tablet: { en: 'tablet', es: 'tablet' },
  // Nuevas palabras para agregar al diccionario

  techero: { en: 'roofer', es: 'techero' },

  mecanico: { en: 'mechanic', es: 'mecanico' },

  muros: { en: 'walls', es: 'muros' },
  walls: { en: 'walls', es: 'muros' },

  negocio: { en: 'business', es: 'negocio' },
  business: { en: 'business', es: 'negocio' },

  experiencia: { en: 'experience', es: 'experiencia' },
  experience: { en: 'experience', es: 'experiencia' },

  tecnica: { en: 'technique', es: 'tecnica' },
  técnica: { en: 'technique', es: 'técnica' },
  technique: { en: 'technique', es: 'tecnica' },

  trabajos: { en: 'jobs', es: 'trabajos' },
  jobs: { en: 'jobs', es: 'trabajos' },

  avanzado: { en: 'advanced', es: 'avanzado' },
  advanced: { en: 'advanced', es: 'avanzado' },

  hogares: { en: 'homes', es: 'hogares' },
  homes: { en: 'homes', es: 'hogares' },

  consulta: { en: 'consultation', es: 'consulta' },
  consultation: { en: 'consultation', es: 'consulta' },

  paredes: { en: 'walls', es: 'paredes' },

  electrodomesticos: { en: 'appliances', es: 'electrodomesticos' },

  potosi: { en: 'potosi', es: 'potosi' },

  tecnico: { en: 'technician', es: 'tecnico' },

  tuberia: { en: 'pipe', es: 'tuberia' },
  tubería: { en: 'pipe', es: 'tubería' },
  pipe: { en: 'pipe', es: 'tuberia' },

  reparador: { en: 'repairman', es: 'reparador' },
  repairman: { en: 'repairman', es: 'reparador' },

  latinoamerica: { en: 'latin america', es: 'latinoamerica' },
  latinoamérica: { en: 'latin america', es: 'latinoamérica' },
  'latin america': { en: 'latin america', es: 'latinoamerica' },

  garaje: { en: 'garage', es: 'garaje' },
  garage: { en: 'garage', es: 'garaje' },

  cochera: { en: 'garage', es: 'cochera' },

  velero: { en: 'sailboat', es: 'velero' },
  sailboat: { en: 'sailboat', es: 'velero' },

  vasos: { en: 'glasses', es: 'vasos' },
  glasses: { en: 'glasses', es: 'vasos' },

  maestro: { en: 'master', es: 'maestro' },
  master: { en: 'master', es: 'maestro' },

  chambeador: { en: 'worker', es: 'chambeador' },
  worker: { en: 'worker', es: 'chambeador' },

  guante: { en: 'glove', es: 'guante' },
  glove: { en: 'glove', es: 'guante' },

  manopla: { en: 'mitten', es: 'manopla' },
  mitten: { en: 'mitten', es: 'manopla' },

  mañana: { en: 'tomorrow', es: 'mañana' },
  tomorrow: { en: 'tomorrow', es: 'mañana' },

  diablo: { en: 'devil', es: 'diablo' },
  devil: { en: 'devil', es: 'diablo' },

  electrico: { en: 'electric', es: 'electrico' },
  eléctrico: { en: 'electric', es: 'eléctrico' },

  bateria: { en: 'battery', es: 'bateria' },
  batería: { en: 'battery', es: 'batería' },
  battery: { en: 'battery', es: 'bateria' },

  horno: { en: 'oven', es: 'horno' },
  oven: { en: 'oven', es: 'horno' },

  pan: { en: 'bread', es: 'pan' },
  bread: { en: 'bread', es: 'pan' },

  piña: { en: 'pineapple', es: 'piña' },
  pineapple: { en: 'pineapple', es: 'piña' },

  copa: { en: 'cup', es: 'copa' },
  cup: { en: 'cup', es: 'copa' },

  cañon: { en: 'canyon', es: 'cañon' },
  cañón: { en: 'canyon', es: 'cañón' },
  canyon: { en: 'canyon', es: 'cañon' },

  mapa: { en: 'map', es: 'mapa' },
  map: { en: 'map', es: 'mapa' },

  vuelo: { en: 'flight', es: 'vuelo' },
  flight: { en: 'flight', es: 'vuelo' },

  vidrieria: { en: 'glasswork', es: 'vidrieria' },
  vidrería: { en: 'glasswork', es: 'vidrería' },
  glasswork: { en: 'glasswork', es: 'vidrieria' },

  texturas: { en: 'textures', es: 'texturas' },
  textures: { en: 'textures', es: 'texturas' },

  blanco: { en: 'white', es: 'blanco' },
  white: { en: 'white', es: 'blanco' },

  mesero: { en: 'waiter', es: 'mesero' },
  waiter: { en: 'waiter', es: 'mesero' },

  ingeniero: { en: 'engineer', es: 'ingeniero' },
  engineer: { en: 'engineer', es: 'ingeniero' },

  sanista: { en: 'plumber', es: 'sanista' },

  repara: { en: 'repairs', es: 'repara' },
  repairs: { en: 'repairs', es: 'repara' },

  soleado: { en: 'sunny', es: 'soleado' },
  sunny: { en: 'sunny', es: 'soleado' },

  calor: { en: 'heat', es: 'calor' },
  heat: { en: 'heat', es: 'calor' },

  frio: { en: 'cold', es: 'frio' },
  frío: { en: 'cold', es: 'frío' },
  cold: { en: 'cold', es: 'frio' },

  japon: { en: 'japan', es: 'japon' },
  japón: { en: 'japan', es: 'japón' },
  japan: { en: 'japan', es: 'japon' },

  papa: { en: 'potato', es: 'papa' },
  potato: { en: 'potato', es: 'papa' },

  jamon: { en: 'ham', es: 'jamon' },
  jamón: { en: 'ham', es: 'jamón' },
  ham: { en: 'ham', es: 'jamon' },

  cometa: { en: 'kite', es: 'cometa' },
  kite: { en: 'kite', es: 'cometa' },

  poder: { en: 'power', es: 'poder' },
  power: { en: 'power', es: 'poder' },

  techista: { en: 'roofer', es: 'techista' },

  fallo: { en: 'failure', es: 'fallo' },
  failure: { en: 'failure', es: 'fallo' },

  nadie: { en: 'nobody', es: 'nadie' },
  nobody: { en: 'nobody', es: 'nadie' },

  cine: { en: 'cinema', es: 'cine' },
  cinema: { en: 'cinema', es: 'cine' },

  accion: { en: 'action', es: 'accion' },
  acción: { en: 'action', es: 'acción' },
  action: { en: 'action', es: 'accion' },

  pais: { en: 'country', es: 'pais' },
  país: { en: 'country', es: 'país' },
  country: { en: 'country', es: 'pais' },

  minero: { en: 'miner', es: 'minero' },
  miner: { en: 'miner', es: 'minero' },

  valor: { en: 'value', es: 'valor' },
  value: { en: 'value', es: 'valor' },

  dinero: { en: 'money', es: 'dinero' },
  money: { en: 'money', es: 'dinero' },

  vidrios: { en: 'glass', es: 'vidrios' },

  cuento: { en: 'story', es: 'cuento' },
  story: { en: 'story', es: 'cuento' },

  desagüe: { en: 'drain', es: 'desagüe' },
  desague: { en: 'drain', es: 'desague' },
  drain: { en: 'drain', es: 'desagüe' },

  cuartos: { en: 'rooms', es: 'cuartos' },
  rooms: { en: 'rooms', es: 'cuartos' },

  clean: { en: 'clean', es: 'limpio' },
  limpio: { en: 'clean', es: 'limpio' },

  diseño: { en: 'design', es: 'diseño' },
  design: { en: 'design', es: 'diseño' },

  glassworker: { en: 'glassworker', es: 'vidriero' },

  cerrajeria: { en: 'locksmithing', es: 'cerrajeria' },
  cerrajería: { en: 'locksmithing', es: 'cerrajería' },
  locksmithing: { en: 'locksmithing', es: 'cerrajeria' },

  pisos: { en: 'floors', es: 'pisos' },
  floors: { en: 'floors', es: 'pisos' },

  luces: { en: 'lights', es: 'luces' },
  lights: { en: 'lights', es: 'luces' },

  extensiones: { en: 'extensions', es: 'extensiones' },
  extensions: { en: 'extensions', es: 'extensiones' },

  paneles: { en: 'panels', es: 'paneles' },
  panels: { en: 'panels', es: 'paneles' },

  terreno: { en: 'land', es: 'terreno' },
  land: { en: 'land', es: 'terreno' },

  terrenos: { en: 'lands', es: 'terrenos' },
  lands: { en: 'lands', es: 'terrenos' },

  musica: { en: 'music', es: 'musica' },
  música: { en: 'music', es: 'música' },
  music: { en: 'music', es: 'musica' },

  plantas: { en: 'plants', es: 'plantas' },
  plants: { en: 'plants', es: 'plantas' },

  reparaciones: { en: 'repairs', es: 'reparaciones' },

  manejo: { en: 'handling', es: 'manejo' },
  handling: { en: 'handling', es: 'manejo' },

  bienvenido: { en: 'welcome', es: 'bienvenido' },
  welcome: { en: 'welcome', es: 'bienvenido' },

  automaticos: { en: 'automatic', es: 'automaticos' },

  hormigon: { en: 'concrete', es: 'hormigon' },

  baño: { en: 'bathroom', es: 'baño' },
  bathroom: { en: 'bathroom', es: 'baño' },

  cable: { en: 'cable', es: 'cable' },

  fonteneria: { en: 'plumbing', es: 'fonteneria' },
  fontanería: { en: 'plumbing', es: 'fontanería' },

  techos: { en: 'roofs', es: 'techos' },
  roofs: { en: 'roofs', es: 'techos' },

  levantamiento: { en: 'survey', es: 'levantamiento' },
  survey: { en: 'survey', es: 'levantamiento' },

  dinamica: { en: 'dynamic', es: 'dinamica' },
  dinámica: { en: 'dynamic', es: 'dinámica' },
  dynamic: { en: 'dynamic', es: 'dinamica' },

  muebles: { en: 'furniture', es: 'muebles' },
  furniture: { en: 'furniture', es: 'muebles' },

  interiores: { en: 'interiors', es: 'interiores' },
  interiors: { en: 'interiors', es: 'interiores' },

  prueba: { en: 'test', es: 'prueba' },
  test: { en: 'test', es: 'prueba' },

  ruido: { en: 'noise', es: 'ruido' },
  noise: { en: 'noise', es: 'ruido' },

  instalaciones: { en: 'facilities', es: 'instalaciones' },
  facilities: { en: 'facilities', es: 'instalaciones' },

  gamer: { en: 'gamer', es: 'gamer' },

  filtro: { en: 'filter', es: 'filtro' },
  filter: { en: 'filter', es: 'filtro' },

  pintores: { en: 'painters', es: 'pintores' },
  painters: { en: 'painters', es: 'pintores' },

  linux: { en: 'linux', es: 'linux' },

  cesped: { en: 'lawn', es: 'cesped' },
  césped: { en: 'lawn', es: 'césped' },
  lawn: { en: 'lawn', es: 'cesped' },

  jardineria: { en: 'gardening', es: 'jardineria' },

  carpinteria: { en: 'carpentry', es: 'carpinteria' },

  patineta: { en: 'skateboard', es: 'patineta' },
  skateboard: { en: 'skateboard', es: 'patineta' },

  techeria: { en: 'roofing', es: 'techeria' },
  techería: { en: 'roofing', es: 'techería' },
  roofing: { en: 'roofing', es: 'techeria' },

  pulidor: { en: 'polisher', es: 'pulidor' },
  polisher: { en: 'polisher', es: 'pulidor' },

  flores: { en: 'flowers', es: 'flores' },
  flowers: { en: 'flowers', es: 'flores' },

  puertas: { en: 'doors', es: 'puertas' },
  doors: { en: 'doors', es: 'puertas' },

  auto: { en: 'car', es: 'auto' },

  poda: { en: 'pruning', es: 'poda' },
  pruning: { en: 'pruning', es: 'poda' },

  carpiteria: { en: 'carpentry', es: 'carpiteria' },

  tarija: { en: 'tarija', es: 'tarija' },

  constructor: { en: 'builder', es: 'constructor' },
  builder: { en: 'builder', es: 'constructor' },

  casas: { en: 'houses', es: 'casas' },
  houses: { en: 'houses', es: 'casas' },
  // Servicios del hogar
  limpieza: { en: 'cleaning', es: 'limpieza' },
  cleaning: { en: 'cleaning', es: 'limpieza' }, // ⭐ INVERSA
  jardinería: { en: 'gardening', es: 'jardinería' },
  gardening: { en: 'gardening', es: 'jardinería' }, // ⭐ INVERSA
  pintura: { en: 'painting', es: 'pintura' },
  painting: { en: 'painting', es: 'pintura' }, // ⭐ INVERSA
  construcción: { en: 'construction', es: 'construcción' },
  construction: { en: 'construction', es: 'construcción' }, // ⭐ INVERSA
  reformas: { en: 'renovations', es: 'reformas' },
  renovations: { en: 'renovations', es: 'reformas' }, // ⭐ INVERSA
  remodelación: { en: 'remodeling', es: 'remodelación' },
  remodeling: { en: 'remodeling', es: 'remodelación' }, // ⭐ INVERSA

  // Términos de búsqueda comunes
  casa: { en: 'house', es: 'casa' },
  house: { en: 'house', es: 'casa' }, // ⭐ INVERSA
  apartamento: { en: 'apartment', es: 'apartamento' },
  apartment: { en: 'apartment', es: 'apartamento' }, // ⭐ INVERSA
  oficina: { en: 'office', es: 'oficina' },
  office: { en: 'office', es: 'oficina' }, // ⭐ INVERSA
  local: { en: 'premises', es: 'local' },
  premises: { en: 'premises', es: 'local' }, // ⭐ INVERSA
  emergencia: { en: 'emergency', es: 'emergencia' },
  emergency: { en: 'emergency', es: 'emergencia' }, // ⭐ INVERSA
  urgente: { en: 'urgent', es: 'urgente' },
  urgent: { en: 'urgent', es: 'urgente' }, // ⭐ INVERSA
  profesional: { en: 'professional', es: 'profesional' },
  professional: { en: 'professional', es: 'profesional' }, // ⭐ INVERSA
  calificado: { en: 'qualified', es: 'calificado' },
  qualified: { en: 'qualified', es: 'calificado' }, // ⭐ INVERSA
  experto: { en: 'expert', es: 'experto' },
  expert: { en: 'expert', es: 'experto' }, // ⭐ INVERSA

  // Términos técnicos
  electrical: { en: 'electrical', es: 'eléctrico' }, // ⭐ INVERSA
  hidráulico: { en: 'hydraulic', es: 'hidráulico' },
  hydraulic: { en: 'hydraulic', es: 'hidráulico' }, // ⭐ INVERSA
  sanitario: { en: 'sanitary', es: 'sanitario' },
  sanitary: { en: 'sanitary', es: 'sanitario' }, // ⭐ INVERSA
  estructura: { en: 'structure', es: 'estructura' },
  structure: { en: 'structure', es: 'estructura' }, // ⭐ INVERSA
  cimientos: { en: 'foundations', es: 'cimientos' },
  foundations: { en: 'foundations', es: 'cimientos' }, // ⭐ INVERSA

  // Términos generales
  presupuesto: { en: 'budget', es: 'presupuesto' },
  budget: { en: 'budget', es: 'presupuesto' }, // ⭐ INVERSA
  cotización: { en: 'quote', es: 'cotización' },
  quote: { en: 'quote', es: 'cotización' }, // ⭐ INVERSA
  garantía: { en: 'warranty', es: 'garantía' },
  warranty: { en: 'warranty', es: 'garantía' }, // ⭐ INVERSA
  calidad: { en: 'quality', es: 'calidad' },
  quality: { en: 'quality', es: 'calidad' }, // ⭐ INVERSA
  servicio: { en: 'service', es: 'servicio' },
  service: { en: 'service', es: 'servicio' }, // ⭐ INVERSA

  // Términos específicos
  car: { en: 'car', es: 'car' },
  carp: { en: 'carp', es: 'carp' },
  carlo: { en: 'carlo', es: 'carlo' },
  carlos: { en: 'carlos', es: 'carlos' },
  electric: { en: 'electric', es: 'electric' },
  elec: { en: 'elec', es: 'elec' },
  electronic: { en: 'electronic', es: 'electronic' },
  electronics: { en: 'electronics', es: 'electronics' },
  en: { en: 'on', es: 'en' },
  on: { en: 'on', es: 'en' }, // ⭐ INVERSA
  de: { en: 'the', es: 'de' },
  the: { en: 'the', es: 'de' }, // ⭐ INVERSA (cuidado con esto)
  canaletas: { en: 'gutters', es: 'canaletas' },
  gutters: { en: 'gutters', es: 'canaletas' }, // ⭐ INVERSA
  automatico: { en: 'automatic', es: 'automatico' },
  automatic: { en: 'automatic', es: 'automatico' }, // ⭐ INVERSA
  automáticos: { en: 'automatics', es: 'automatico' },
  automatics: { en: 'automatics', es: 'automatico' }, // ⭐ INVERSA
  hogar: { en: 'house', es: 'hogar' },
  hola: { en: 'hello', es: 'hola' },
  hello: { en: 'hello', es: 'hola' }, // ⭐ INVERSA
  hormigón: { en: 'concrete', es: 'hormigon' },
  concrete: { en: 'concrete', es: 'hormigon' },
  bricklayer: { en: 'bricklayer', es: 'albañil' },

  techador: { en: 'roofer', es: 'techador' },
  roofer: { en: 'roofer', es: 'techador' },

  yesero: { en: 'plasterer', es: 'yesero' },
  plasterer: { en: 'plasterer', es: 'yesero' },

  vidriero: { en: 'glazier', es: 'vidriero' },
  glazier: { en: 'glazier', es: 'vidriero' },

  soldador: { en: 'welder', es: 'soldador' },
  welder: { en: 'welder', es: 'soldador' },

  gasista: { en: 'gas fitter', es: 'gasista' },
  'gas fitter': { en: 'gas fitter', es: 'gasista' },

  decorador: { en: 'decorator', es: 'decorador' },
  decorator: { en: 'decorator', es: 'decorador' },

  limpiador: { en: 'cleaner', es: 'limpiador' },
  cleaner: { en: 'cleaner', es: 'limpiador' },

  desarrollador: { en: 'developer', es: 'desarrollador' },
  developer: { en: 'developer', es: 'desarrollador' },

  chofer: { en: 'driver', es: 'chofer' },
  driver: { en: 'driver', es: 'chofer' },

  profesor: { en: 'teacher', es: 'profesor' },
  teacher: { en: 'teacher', es: 'profesor' },

  'ingeniero civil': { en: 'civil engineer', es: 'ingeniero civil' },
  'civil engineer': { en: 'civil engineer', es: 'ingeniero civil' },

  // ======= AMBIENTES =======
  home: { en: 'home', es: 'hogar' },

  negocios: { en: 'businesses', es: 'negocios' },
  businesses: { en: 'businesses', es: 'negocios' },

  obras: { en: 'works', es: 'obras' },
  works: { en: 'works', es: 'obras' },

  remodelaciones: { en: 'remodeling', es: 'remodelaciones' },

  muro: { en: 'wall', es: 'muro' },
  wall: { en: 'wall', es: 'muro' },

  exterior: { en: 'exterior', es: 'exterior' },
  interior: { en: 'interior', es: 'interior' },

  agua: { en: 'water', es: 'agua' },
  water: { en: 'water', es: 'agua' },

  electricidad: { en: 'electricity', es: 'electricidad' },
  electricity: { en: 'electricity', es: 'electricidad' },

  madera: { en: 'wood', es: 'madera' },
  wood: { en: 'wood', es: 'madera' },

  metal: { en: 'metal', es: 'metal' },

  piso: { en: 'floor', es: 'piso' },
  floor: { en: 'floor', es: 'piso' },

  techo: { en: 'roof', es: 'techo' },
  roof: { en: 'roof', es: 'techo' },

  ventana: { en: 'window', es: 'ventana' },
  window: { en: 'window', es: 'ventana' },

  puerta: { en: 'door', es: 'puerta' },
  door: { en: 'door', es: 'puerta' },

  ducha: { en: 'shower', es: 'ducha' },
  shower: { en: 'shower', es: 'ducha' },

  parrillas: { en: 'grills', es: 'parrillas' },
  grills: { en: 'grills', es: 'parrillas' },

  hornos: { en: 'ovens', es: 'hornos' },
  ovens: { en: 'ovens', es: 'hornos' },

  // ======= PALABRAS GENERALES =======
  trabajo: { en: 'job', es: 'trabajo' },
  adiós: { en: 'goodbye', es: 'adiós' },
  goodbye: { en: 'goodbye', es: 'adiós' },
  buenas: { en: 'hello', es: 'buenas' },

  // ======= LUGARES (NO SE TRADUCEN) =======
  cochabamba: { en: 'cochabamba', es: 'cochabamba' },
  'la paz': { en: 'la paz', es: 'la paz' },
  'santa cruz': { en: 'santa cruz', es: 'santa cruz' },
  oruro: { en: 'oruro', es: 'oruro' },
  potosí: { en: 'potosí', es: 'potosí' },
  beni: { en: 'beni', es: 'beni' },
  pando: { en: 'pando', es: 'pando' },
  chuquisaca: { en: 'chuquisaca', es: 'chuquisaca' },
  perú: { en: 'peru', es: 'perú' },
};

function preserveCapitalization(original: string, translation: string): string {
  if (original === original.toUpperCase()) {
    return translation.toUpperCase();
  } else if (original[0] === original[0].toUpperCase()) {
    return translation.charAt(0).toUpperCase() + translation.slice(1);
  } else {
    return translation;
  }
}

/**
 * Traduce un array de sugerencias usando el diccionario
 */
export function translateSuggestions(suggestions: string[], targetLang: 'en' | 'es'): string[] {
  if (suggestions.length === 0) {
    return suggestions;
  }

  console.log(`🔍 Translating ${suggestions.length} suggestions to ${targetLang}`);
  console.log(`🔍 Original suggestions:`, suggestions);

  const translated = suggestions.map((suggestion) =>
    translateWithDictionary(suggestion, targetLang),
  );

  console.log(`🔍 Translated suggestions:`, translated);
  return translated;
}

/**
 * Traduce un texto individual usando el diccionario
 */
export function translateWithDictionary(text: string, targetLang: 'en' | 'es'): string {
  console.log(`🔍 Attempting to translate: "${text}" to ${targetLang}`);

  const normalizedText = text.toLowerCase().trim();

  // 1. Búsqueda EXACTA
  const exactKey = Object.keys(translationDictionary).find(
    (key) => key.toLowerCase() === normalizedText,
  );

  if (exactKey) {
    const translation = translationDictionary[exactKey][targetLang];
    console.log(`✅ Exact dictionary match: "${text}" -> "${translation}"`);
    return preserveCapitalization(text, translation);
  }

  console.log(`❌ No exact match for: "${text}" (normalized: "${normalizedText}")`);

  // 2. Búsqueda por PALABRAS CONTENIDAS
  let translatedText = text;
  let foundAnyMatch = false;

  const sortedKeys = Object.keys(translationDictionary).sort((a, b) => b.length - a.length);

  for (const dictKey of sortedKeys) {
    const regex = new RegExp(`\\b${dictKey}\\b`, 'gi');
    if (regex.test(text)) {
      foundAnyMatch = true;
      translatedText = translatedText.replace(regex, (match) => {
        const translation = translationDictionary[dictKey][targetLang];
        console.log(`🔄 Partial match: "${match}" -> "${translation}" in "${text}"`);
        return preserveCapitalization(match, translation);
      });
    }
  }

  if (foundAnyMatch) {
    console.log(`✅ Final translated: "${text}" -> "${translatedText}"`);
    return translatedText;
  }

  console.log(`❌ No dictionary translation for: "${text}"`);
  return text;
}
