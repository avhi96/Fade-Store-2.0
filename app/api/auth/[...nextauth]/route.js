import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "1487055588390342816",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "7dQ_uf36gqJNTkZHfhfXGwI7l7FbvR_F",
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub
      return session
    },
    redirect({ url, baseUrl }) {
      // Redirect to home page after successful login
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST }
