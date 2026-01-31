import { getWorkspaceData } from "./actions"
import { TaskOrchestrationClient } from "./task-orchestration-client"
import { comingSoonItemKeys } from "@/lib/mock-data"

export default async function TaskOrchestrationPage() {
  let data
  let error: string | null = null
  try {
    data = await getWorkspaceData()
  } catch (err) {
    console.error("[TaskOrchestrationPage] Failed to load data:", err)
    error = err instanceof Error ? err.message : "Failed to load workspace data"
    data = {
      matters: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    }
  }

  return <TaskOrchestrationClient initialData={data} error={error} />
}
