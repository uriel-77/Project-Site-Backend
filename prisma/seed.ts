import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra de contenidos de Compiladores...');

  // 1. Unidades
  const unidades = [
    { id: 1, nombre: 'Unidad I - Introducción y uso de autómatas en los compiladores' },
    { id: 2, nombre: 'Unidad II - Uso de Gramáticas' },
    { id: 3, nombre: 'Unidad III - Implementación de un Analizador Léxico' },
    { id: 4, nombre: 'Unidad IV - Implementación de un Analizador Sintáctico' },
    { id: 5, nombre: 'Unidad V - Traducción Orientada por la Sintaxis' },
  ];

  for (const u of unidades) {
    await prisma.unidad.upsert({
      where: { id: u.id },
      update: {},
      create: { id: u.id, nombre: u.nombre },
    });
  }

  // 2. Contenido 1.1
  await prisma.contenido.create({
    data: {
      titulo: '1.1 Sistemas formales y teoría de conjuntos',
      descripcion: 'Definición de sistema formal, propiedades y operaciones.',
      tipo: 'LECCION',
      orden: 1,
      unidadId: 1,
      contenido: [
        "SISTEMA, es un conjunto de elementos independientes pero interrelacionados...",
        "https://drive.google.com/file/d/1k75pGK7fzxw8bxjD_Or6wXGcBWj8HLrP/view"
      ]
    }
  });

  // 3. Insignias
  await prisma.insignia.createMany({
    data: [
      { nombre: 'Primer Paso', nivel: 'Bronce', descripcion: 'Completaste tu primer contenido del curso.', icon: '🥉', color: '#cd7f32', requisito: 1 },
      { nombre: 'En Camino', nivel: 'Bronce', descripcion: 'Completaste 5 contenidos.', icon: '📚', color: '#cd7f32', requisito: 5 },
      { nombre: 'Mitad del Camino', nivel: 'Plata', descripcion: 'Completaste 9 contenidos.', icon: '🥈', color: '#c0c0c0', requisito: 9 },
      { nombre: 'Casi Experto', nivel: 'Plata', descripcion: 'Completaste 14 contenidos.', icon: '⚡', color: '#c0c0c0', requisito: 14 },
      { nombre: 'Compilador Master', nivel: 'Oro', descripcion: 'Completaste todos los contenidos del curso.', icon: '🥇', color: '#ffd700', requisito: 18 },
    ],
    skipDuplicates: true, // Si ya existen no tronará
  });

  console.log('✅ ¡Siembra completada con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });