import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "views.json")
const viewCountKey = process.env.VIEW_COUNT_KEY ?? "bio-website:views"

type RedisResponse = {
  result?: number | string | null
  error?: string
}

function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

  return url && token ? { url: url.replace(/\/$/, ""), token } : null
}

async function runRedisCommand(command: string[]) {
  const config = getRedisConfig()

  if (!config) {
    throw new Error("Redis is not configured")
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })

  const data = (await response.json()) as RedisResponse

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Redis request failed (${response.status})`)
  }

  return data.result
}

function getLocalCount(): number {
  try {
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data).count ?? 0
  } catch {
    return 0
  }
}

function setLocalCount(count: number) {
  fs.writeFileSync(filePath, JSON.stringify({ count }), "utf-8")
}

export async function GET() {
  try {
    if (getRedisConfig()) {
      const result = await runRedisCommand(["GET", viewCountKey])
      return NextResponse.json(
        { count: Number(result ?? 0) },
        { headers: { "Cache-Control": "no-store" } },
      )
    }

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ count: getLocalCount() })
    }

    return NextResponse.json(
      { error: "View counter storage is not configured" },
      { status: 503 },
    )
  } catch (error) {
    console.error("Failed to read view count:", error)
    return NextResponse.json(
      { error: "Failed to read view count" },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    if (getRedisConfig()) {
      const result = await runRedisCommand(["INCR", viewCountKey])
      return NextResponse.json(
        { count: Number(result) },
        { headers: { "Cache-Control": "no-store" } },
      )
    }

    if (process.env.NODE_ENV === "development") {
      const newCount = getLocalCount() + 1
      setLocalCount(newCount)
      return NextResponse.json({ count: newCount })
    }

    return NextResponse.json(
      { error: "View counter storage is not configured" },
      { status: 503 },
    )
  } catch (error) {
    console.error("Failed to increment view count:", error)
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 },
    )
  }
}
