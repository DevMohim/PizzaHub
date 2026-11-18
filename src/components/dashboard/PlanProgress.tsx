"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

/**
 * Client wrapper for the subscription plan meter.
 * Base UI's `ProgressValue` expects a render-function child, and functions
 * cannot cross the Server → Client boundary, so this block lives here.
 */
const PlanProgress = ({ used, max }: { used: number; max: number }) => (
  <Progress
    value={max > 0 ? Math.min((used / max) * 100, 100) : 0}
    className="w-full gap-1.5"
  >
    <ProgressLabel className="text-muted-foreground w-full text-xs">
      Active items used
    </ProgressLabel>
    <ProgressValue className="w-full text-xs">
      {() => `${used} / ${max}`}
    </ProgressValue>
  </Progress>
);

export default PlanProgress;
