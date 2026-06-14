"use client"

import { useSession }
  from 'next-auth/react'

import { useEffect }
  from 'react'

export default function UserSync() {

  const { data: session } =
    useSession()

  useEffect(() => {

    if (
      !session?.user?.discordId
    ) {
      return
    }

    async function syncUser() {

      try {

        await fetch(
          '/api/users/sync',
          {

            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              id:
                session.user.discordId,

              name:
                session.user.name,

              email:
                session.user.email,

              image:
                session.user.image,
            }),
          }
        )

      } catch (error) {

        console.error(
          'User sync failed:',
          error
        )
      }
    }

    syncUser()

  }, [session])

  return null
}