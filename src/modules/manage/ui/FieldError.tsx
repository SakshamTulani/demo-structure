/** The first schema message for a field, tied to its input by id for screen readers. */
export function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <p id={id} className="text-destructive text-sm">
      {messages[0]}
    </p>
  )
}
