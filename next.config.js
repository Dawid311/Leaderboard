/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  },
}

module.exports = nextConfig
