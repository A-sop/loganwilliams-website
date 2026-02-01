'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { testOpenAIConnection } from '@/lib/openai';
import type { Case, Task, Document, Contact, TimelineEvent } from '@/lib/mock-data';
import { comingSoonItemKeys } from '@/lib/mock-data';
import { addTaskSchema } from '@/lib/schemas/add-task';

export type WorkspaceData = {
  assignments: Case[];
  tasks: Task[];
  documents: Document[];
  contacts: Contact[];
  timeline: TimelineEvent[];
  comingSoonItemKeys: typeof comingSoonItemKeys;
};

const WORKSPACE_PATH = path.join(process.cwd(), 'src', 'data', 'workspace.json');

/** Load workspace data from JSON file. Falls back to empty arrays on error. */
export async function getWorkspaceData(): Promise<WorkspaceData> {
  try {
    const raw = await readFile(WORKSPACE_PATH, 'utf-8');
    const data = JSON.parse(raw) as {
      matters?: Case[];
      assignments?: Case[];
      tasks: Task[];
      documents: Document[];
      contacts: Contact[];
      timeline: TimelineEvent[];
    };
    const assignmentList = data.assignments ?? data.matters ?? [];
    console.log('[getWorkspaceData] Loaded', assignmentList.length, 'assignments');
    return {
      assignments: assignmentList,
      tasks: data.tasks,
      documents: data.documents,
      contacts: data.contacts,
      timeline: data.timeline,
      comingSoonItemKeys,
    };
  } catch (err) {
    console.error('[getWorkspaceData] Error:', err);
    return {
      assignments: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    };
  }
}

export type { AddTaskInput } from '@/lib/schemas/add-task';

/** Add a new task (e.g. "Submit residence permit application"). Persists to workspace.json. */
export async function addTask(
  input: unknown
): Promise<{ ok: true; task: Task } | { ok: false; error: string }> {
  const parsed = addTaskSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Invalid input';
    return { ok: false, error: String(msg) };
  }
  const { title, caseId, status, priority, dueDate, owner, waitingOn } = parsed.data;
  try {
    const raw = await readFile(WORKSPACE_PATH, 'utf-8');
    const data = JSON.parse(raw) as {
      assignments?: Case[];
      matters?: Case[];
      tasks: Task[];
    };
    const assignments = data.assignments ?? data.matters ?? [];
    const tasks = data.tasks ?? [];
    const newId = `task-${Date.now()}`;
    const assignment = caseId ? assignments.find((a: Case) => a.id === caseId) : null;
    const task: Task = {
      id: newId,
      title,
      caseId,
      caseClient: assignment ? (assignment as Case).client : undefined,
      status,
      priority,
      dueDate,
      owner,
      waitingOn,
    };
    const nextTasks = [...tasks, task];
    const nextAssignments = caseId
      ? assignments.map((a: Case) =>
          a.id === caseId ? { ...a, taskCount: (a.taskCount ?? 0) + 1 } : a
        )
      : assignments;
    await writeFile(
      WORKSPACE_PATH,
      JSON.stringify(
        { ...data, assignments: nextAssignments, tasks: nextTasks },
        null,
        2
      ),
      'utf-8'
    );
    return { ok: true, task };
  } catch (err) {
    console.error('[addTask] Error:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to add task' };
  }
}

/** Test OpenAI connectivity. Returns { ok, text } or { ok: false, error }. */
export async function testOpenAI(): Promise<
  { ok: true; text: string } | { ok: false; error: string }
> {
  return testOpenAIConnection();
}
