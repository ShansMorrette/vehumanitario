import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { personasLocalizadas } from "./schema";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL no está definida");
    process.exit(1);
  }
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  const registros = [
    {
      nombreCompleto: "María Elena Rodríguez Pérez",
      cedula: "V-12345678",
      estatus: "Hospitalizado" as const,
      ubicacion: "Hospital Central de Valencia - Piso 3, Ala Sur",
      ultimaActualizacion: new Date("2025-07-10T08:30:00Z"),
    },
    {
      nombreCompleto: "Carlos Andrés Martínez López",
      cedula: "V-23456789",
      estatus: "Localizado" as const,
      ubicacion: "Refugio Temporal - Sector La Candelaria, Caracas",
      ultimaActualizacion: new Date("2025-07-10T10:15:00Z"),
    },
    {
      nombreCompleto: "Ana Gabriela Hernández",
      cedula: null,
      estatus: "En Verificación" as const,
      ubicacion: "Clínica Santa María - Maracaibo",
      ultimaActualizacion: new Date("2025-07-10T06:45:00Z"),
    },
    {
      nombreCompleto: "José Luis Gutiérrez Morales",
      cedula: "V-34567890",
      estatus: "Hospitalizado" as const,
      ubicacion: "Hospital Universitario de Maracaibo - UCI",
      ultimaActualizacion: new Date("2025-07-10T12:00:00Z"),
    },
    {
      nombreCompleto: "Rosa María Díaz Contreras",
      cedula: "V-45678901",
      estatus: "Localizado" as const,
      ubicacion: "Centro de Acopio - Sector El Paraíso, Caracas",
      ultimaActualizacion: new Date("2025-07-09T22:30:00Z"),
    },
    {
      nombreCompleto: "Pedro José Ramírez",
      cedula: "V-56789012",
      estatus: "En Verificación" as const,
      ubicacion: "Hospital de Niños J.M. de los Ríos - Caracas",
      ultimaActualizacion: new Date("2025-07-10T14:20:00Z"),
    },
    {
      nombreCompleto: "Carmen Teresa Flores Vega",
      cedula: "V-67890123",
      estatus: "Localizado" as const,
      ubicacion: "Refugio Municipal - Barquisimeto, Lara",
      ultimaActualizacion: new Date("2025-07-10T09:50:00Z"),
    },
    {
      nombreCompleto: "Luis Fernando Mendoza Salas",
      cedula: null,
      estatus: "Hospitalizado" as const,
      ubicacion: "Clínica Razetti - Barcelona, Anzoátegui",
      ultimaActualizacion: new Date("2025-07-10T07:10:00Z"),
    },
    {
      nombreCompleto: "Gabriela Alejandra Torres",
      cedula: "V-78901234",
      estatus: "Localizado" as const,
      ubicacion: "Escuela Bolivariana Simón Bolívar - Mérida",
      ultimaActualizacion: new Date("2025-07-10T11:30:00Z"),
    },
    {
      nombreCompleto: "Francisco Javier López Castillo",
      cedula: "V-89012345",
      estatus: "En Verificación" as const,
      ubicacion: "Hospital Militar Dr. Carlos Arvelo - Caracas",
      ultimaActualizacion: new Date("2025-07-10T13:45:00Z"),
    },
  ];

  // Clear existing data
  await db.delete(personasLocalizadas);

  // Insert seed data
  await db.insert(personasLocalizadas).values(registros);

  console.log(`✅ Se insertaron ${registros.length} registros de prueba.`);

  await pool.end();
}

seed().catch(console.error);
