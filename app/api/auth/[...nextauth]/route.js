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
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.discordId = profile.id
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.discordId = token.discordId
      }
      return session
    },
    redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST }
