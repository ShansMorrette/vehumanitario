import { db } from "@/db";
import { personasLocalizadas } from "@/db/schema";
import { or, ilike, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return Response.json(
      { data: [], error: "La búsqueda debe tener al menos 2 caracteres." },
      { status: 400 }
    );
  }

  try {
    const searchTerm = `%${q}%`;

    const results = await db
      .select()
      .from(personasLocalizadas)
      .where(
        or(
          ilike(personasLocalizadas.nombreCompleto, searchTerm),
          ilike(personasLocalizadas.cedula, searchTerm)
        )
      )
      .orderBy(personasLocalizadas.ultimaActualizacion)
      .limit(50);

    return Response.json({ data: results, error: null });
  } catch (err) {
    console.error("Error en búsqueda:", err);
    return Response.json(
      { data: [], error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
