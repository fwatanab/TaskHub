import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt"},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			authorization: {
				params: {
					prompt: "select_account",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: "/signin",
	},
};
