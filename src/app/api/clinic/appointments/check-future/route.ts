import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ hasFuture: false }); // ou erro
  }

  const count = await prisma.appointment.count({
    where: {
      userId: session.user.id,
      appointmentDate: { gte: new Date() },
    },
  });

  return NextResponse.json({ hasFuture: count > 0 });
}
