import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ADMIN_IDS } from '@/lib/admins'

export async function requireAdmin() {

  const session = await getServerSession(authOptions)

  // not logged in
  const discordId =
    session?.user?.discordId ||
    session?.user?.id ||
    ''

  if (!discordId) {

    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    }
  }

  // not admin
  if (!ADMIN_IDS.includes(discordId)) {

    return {
      ok: false,
      status: 403,
      error: 'Forbidden',
    }
  }

  return {
    ok: true,
    session,
  }
}
