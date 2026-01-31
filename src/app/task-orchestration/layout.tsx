import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workspace | Executive Concierge",
  description:
    "Matters, tasks, and documents — Executive Concierge workspace for managing client matters and workflows.",
}

export default function TaskOrchestrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
