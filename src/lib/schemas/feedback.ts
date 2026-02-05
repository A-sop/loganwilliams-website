import { z } from 'zod';

export const feedbackSchema = z.object({
  description: z
    .string()
    .min(1, 'Please enter at least one character')
    .trim(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
