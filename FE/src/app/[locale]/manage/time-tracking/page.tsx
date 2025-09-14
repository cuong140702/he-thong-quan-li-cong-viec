import React, { Suspense } from "react";
import TimeTracking from "./time-tracking";

export default function TimeTrackingPage() {
  return (
    <Suspense>
      <TimeTracking />
    </Suspense>
  );
}
