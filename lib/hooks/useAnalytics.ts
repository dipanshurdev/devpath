import { useEffect } from "react";

export function useAnalytics() {
  useEffect(() => {
    // This is where you would initialize your analytics service
    console.log("Analytics initialized");
  }, []);

  const trackEvent = (eventName: string, eventData: object) => {
    // This is where you would send the event to your analytics service
    console.log("Event tracked:", eventName, eventData);
  };

  return { trackEvent };
}
