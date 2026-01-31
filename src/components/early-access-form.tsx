"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitEarlyAccess } from "@/app/actions/early-access"
import { useLocale } from "@/components/providers/locale-provider"

const initialState = null as { success: true; message: string } | { success: false; error: string } | null

export function EarlyAccessForm() {
  const { locale, t } = useLocale()
  const [state, formAction, isPending] = useActionState(submitEarlyAccess, initialState)

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("emailAddress")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          required
          className="w-full"
          aria-label={t("emailAriaLabel")}
          aria-describedby={state ? "form-feedback" : undefined}
          aria-invalid={state && !state.success ? true : undefined}
          disabled={isPending}
        />
      </div>
      <div id="form-feedback" role="status" aria-live="polite" className="min-h-[1.5rem]">
        {state?.success && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {state.message}
          </p>
        )}
        {state && !state.success && (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? t("submitting") : t("notifyMe")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {t("privacyNote")}
      </p>
    </form>
  )
}
