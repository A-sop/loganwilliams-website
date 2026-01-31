"use server"

import { validateEmail } from "@/lib/validation"
import { t } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export type EarlyAccessResult =
  | { success: true; message: string }
  | { success: false; error: string }

const supportedLocales = ["en", "de"] as const

/** Server action: submit early access email. No DB yet — simulates success. */
export async function submitEarlyAccess(
  _prevState: unknown,
  formData: FormData
): Promise<EarlyAccessResult> {
  const email = (formData.get("email") as string) ?? ""
  const localeRaw = (formData.get("locale") as string) ?? "en"
  const locale: Locale =
    supportedLocales.includes(localeRaw as Locale) ? (localeRaw as Locale) : "en"

  const validation = validateEmail(email)
  if (!validation.valid) {
    return {
      success: false,
      error: t(locale, `validation.${validation.errorKey}`),
    }
  }

  // Simulate async work; in future, persist to DB
  await new Promise((r) => setTimeout(r, 500))

  return {
    success: true,
    message: t(locale, "earlyAccessSuccess", { email: email.trim() }),
  }
}
