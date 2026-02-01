'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export type PlannedFeature = {
  id: string;
  labelKey: string;
  section: 'must-have' | 'bugs-ideas' | 'fun';
  votes: number;
};

export type UserSuggestion = {
  id: string;
  text: string;
  votes: number;
  createdAt: string;
};

export type FeaturesData = {
  plannedFeatures: PlannedFeature[];
  userSuggestions: UserSuggestion[];
};

const FEATURES_PATH = path.join(process.cwd(), 'src', 'data', 'features.json');

async function loadFeatures(): Promise<FeaturesData> {
  const raw = await readFile(FEATURES_PATH, 'utf-8');
  return JSON.parse(raw) as FeaturesData;
}

async function saveFeatures(data: FeaturesData): Promise<void> {
  await writeFile(FEATURES_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getFeaturesData(): Promise<FeaturesData> {
  try {
    return await loadFeatures();
  } catch (err) {
    console.error('[getFeaturesData] Error:', err);
    return { plannedFeatures: [], userSuggestions: [] };
  }
}

export type VoteResult = { success: true } | { success: false; error: string };

const voteSchema = z.object({ featureId: z.string().min(1).max(100), delta: z.union([z.literal(1), z.literal(-1)]) });

export async function voteFeature(
  featureId: string,
  delta: 1 | -1
): Promise<VoteResult> {
  const parsed = voteSchema.safeParse({ featureId, delta });
  if (!parsed.success) return { success: false, error: 'Invalid vote' };
  const { featureId: id, delta: d } = parsed.data;
  try {
    const data = await loadFeatures();
    const planned = data.plannedFeatures.find((f) => f.id === id);
    const suggestion = data.userSuggestions.find((f) => f.id === id);
    if (planned) {
      planned.votes = Math.max(0, planned.votes + d);
    } else if (suggestion) {
      suggestion.votes = Math.max(0, suggestion.votes + d);
    } else {
      return { success: false, error: 'Feature not found' };
    }
    await saveFeatures(data);
    return { success: true };
  } catch (err) {
    console.error('[voteFeature] Error:', err);
    return { success: false, error: 'Failed to save vote' };
  }
}

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

const suggestionSchema = z.string().transform((s) => s.trim()).pipe(z.string().min(1).max(500));

export async function submitFeatureSuggestion(
  text: string
): Promise<SubmitResult> {
  const parsed = suggestionSchema.safeParse(text);
  if (!parsed.success) {
    return { success: false, error: 'Please enter 1–500 characters' };
  }
  const trimmed = parsed.data;
  try {
    const data = await loadFeatures();
    const id = `sugg-${Date.now()}`;
    data.userSuggestions.push({
      id,
      text: trimmed,
      votes: 0,
      createdAt: new Date().toISOString(),
    });
    await saveFeatures(data);
    return { success: true };
  } catch (err) {
    console.error('[submitFeatureSuggestion] Error:', err);
    return { success: false, error: 'Failed to save suggestion' };
  }
}
