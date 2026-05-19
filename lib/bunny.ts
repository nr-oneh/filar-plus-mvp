import crypto from "crypto"

const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!
const TOKEN_KEY = process.env.BUNNY_TOKEN_KEY!
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME!
const EXPIRY_SECONDS = 4 * 60 * 60 // 4 hours

export function generateSignedUrl(videoId: string): string {
  const expiration = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const hashableBase = `${TOKEN_KEY}${videoId}${expiration}`
  const token = crypto
    .createHash("sha256")
    .update(hashableBase)
    .digest("hex")

  return `https://${CDN_HOSTNAME}/${videoId}/play_720p.mp4?token=${token}&expires=${expiration}`
}

export function generateEmbedUrl(videoId: string): string {
  const expiration = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const hashableBase = `${TOKEN_KEY}${videoId}${expiration}`
  const token = crypto
    .createHash("sha256")
    .update(hashableBase)
    .digest("hex")

  return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expiration}&autoplay=false&preload=true`
}
