import './globals.css'

export const metadata = {
  title: 'Leaderboard API',
  description: 'Leaderboard mit Google Sheets Integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
