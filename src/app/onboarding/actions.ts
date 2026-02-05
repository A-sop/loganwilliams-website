'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export async function completeOnboarding(): Promise<
  { success: true } | { error: string }
> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Not authenticated' };
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { onboardingComplete: true },
    });
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error during update';
    console.error('[completeOnboarding]', message, err);
    return { error: 'Failed to complete onboarding. Please try again.' };
  }
}
