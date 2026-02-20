// lib/session.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../authOptions/authOptions";

export async function getSession() {
  return await getServerSession(authOptions);
}
