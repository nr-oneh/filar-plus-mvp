import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateEmbedUrl } from "@/lib/bunny"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const videoId = req.nextUrl.searchParams.get("videoId")
  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 })
  }

  const video = await prisma.video.findUnique({ where: { id: videoId } })
  if (!video || video.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Video not found" }, { status: 404 })
  }

  if (video.week > session.user.activeWeek) {
    return NextResponse.json({ error: "Week not unlocked" }, { status: 403 })
  }

  const bunnyVideoId = video.bunnyUrl.split("/").pop() ?? video.bunnyUrl
  const signedUrl = generateEmbedUrl(bunnyVideoId)

  return NextResponse.json({ url: signedUrl })
}
