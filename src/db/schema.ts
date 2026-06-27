import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const personasLocalizadas = pgTable("personas_localizadas", {
  id: serial("id").primaryKey(),
  nombreCompleto: text("nombre_completo").notNull(),
  cedula: varchar("cedula", { length: 20 }),
  estatus: varchar("estatus", { length: 30 }).notNull().default("En Verificación"),
  ubicacion: text("ubicacion").notNull(),
  ultimaActualizacion: timestamp("ultima_actualizacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
