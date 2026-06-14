import { getServerSession } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

// Centralized NextAuth options for server-only endpoints (API routes).
// Keep this consistent with `app/api/auth/[...nextauth]/route.js`.
export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
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
}

// Optional convenience wrapper (not used by current redemption routes, but useful).
export function requireServerSession() {
  return getServerSession(authOptions)
}
