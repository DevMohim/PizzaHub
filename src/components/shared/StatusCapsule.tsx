import { cn } from "cn";

interface StatusCapsuleProps {
  /** Capsule text, e.g. "Active", "Pending". */
  label: string;
  /** Tone classes (colors + ring) — usually from a status config. */
  className?: string;
  /** Render the leading status dot (default: true). */
  dot?: boolean;
}

/**
 * Shared status pill used across menu cards and admin tables.
 * Pair it with a status config (e.g. `menuItemStatusStyles`,
 * `userStatusStyles`) so every surface shows matching styles.
 */
const StatusCapsule = ({ label, className, dot = true }: StatusCapsuleProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
      className,
    )}
  >
    {dot && (
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
    )}
    {label}
  </span>
);

export default StatusCapsule;
