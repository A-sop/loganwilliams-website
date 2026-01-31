import { readFile } from "fs/promises"
import path from "path"
import type {
  Case,
  Task,
  Document,
  Contact,
  TimelineEvent,
} from "@/lib/mock-data"
import { comingSoonItemKeys } from "@/lib/mock-data"

export type WorkspaceData = {
  matters: Case[]
  tasks: Task[]
  documents: Document[]
  contacts: Contact[]
  timeline: TimelineEvent[]
  comingSoonItemKeys: typeof comingSoonItemKeys
}

/** Load workspace data from JSON file. Falls back to empty arrays on error. */
export async function getWorkspaceData(): Promise<WorkspaceData> {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "task-orchestration.json"
    )
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw) as {
      matters: Case[]
      tasks: Task[]
      documents: Document[]
      contacts: Contact[]
      timeline: TimelineEvent[]
    }
    console.log("[getWorkspaceData] Loaded", data.matters?.length ?? 0, "matters")
    return {
      ...data,
      comingSoonItemKeys,
    }
  } catch (err) {
    console.error("[getWorkspaceData] Error:", err)
    return {
      matters: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    }
  }
}
