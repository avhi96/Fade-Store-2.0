export async function getUser() {

  try {

    const response =
      await fetch(
        '/api/users/me'
      )

    const data =
      await response.json()

    if (!data.success) {
      return null
    }

    return data.user || null

  } catch (error) {

    console.error(
      'Get user error:',
      error
    )

    return null
  }
}