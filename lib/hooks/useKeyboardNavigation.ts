import { useState, useCallback } from "react";

export function useKeyboardNavigation(totalNodes: number) {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown") {
        setCurrentNodeIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, totalNodes - 1)
        );
      } else if (event.key === "ArrowUp") {
        setCurrentNodeIndex((prev) =>
          prev === null ? totalNodes - 1 : Math.max(prev - 1, 0)
        );
      }
    },
    [totalNodes]
  );

  return { currentNodeIndex, handleKeyDown };
}
