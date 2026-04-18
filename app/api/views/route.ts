import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "views.json")

function getCount(): number {
  try {
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data).count ?? 0
  } catch {
    return 0
  }
}

function setCount(count: number) {
  fs.writeFileSync(filePath, JSON.stringify({ count }), "utf-8")
}

export async function GET() {
  return NextResponse.json({ count: getCount() })
}

export async function POST() {
  const newCount = getCount() + 1
  setCount(newCount)
  return NextResponse.json({ count: newCount })
}
