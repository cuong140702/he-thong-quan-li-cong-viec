import { Suspense } from "react";
import ReminderPage from "./reminderPage";

export default function Reminder() {
  return (
    <Suspense>
      <ReminderPage />
    </Suspense>
  );
}
