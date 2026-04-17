import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}

