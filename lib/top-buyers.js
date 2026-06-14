export async function getTopBuyers({
  limit = 5,
  period = 'all',
} = {}) {

  try {

    const params =
      new URLSearchParams({
        limit:
          String(limit),
        period,
      })

    const response =
      await fetch(
        `/api/top-buyers?${params.toString()}`,
        {
          cache: 'no-store',
        }
      )

    const data =
      await response.json()

    if (!data?.success) {
      return []
    }

    return Array.isArray(data.buyers)
      ? data.buyers
      : []

  } catch (error) {

    console.error(
      'Get top buyers error:',
      error
    )

    return []
  }
}
