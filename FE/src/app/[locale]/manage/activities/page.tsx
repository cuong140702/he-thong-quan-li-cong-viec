import { Suspense } from "react";
import ActivityPage from "./activityPage";

export default function Activity() {
  return (
    <Suspense>
      <ActivityPage />
    </Suspense>
  );
}
