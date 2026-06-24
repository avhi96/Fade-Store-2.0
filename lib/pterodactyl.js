const PANEL_URL =
  process.env.PTERODACTYL_PANEL_URL ||
  "https://panel.example.com"

const API_KEY =
  process.env.PTERODACTYL_API_KEY ||
  "ptlc_mock_api_key"

const SERVER_ID =
  process.env.PTERODACTYL_SERVER_ID ||
  "mock_server"

export async function executeConsoleCommand(command) {
  const response = await fetch(
    `${PANEL_URL}/api/client/servers/${SERVER_ID}/command`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        command,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()

    throw new Error(
      `Pterodactyl Error: ${error}`
    )
  }

  return true
}