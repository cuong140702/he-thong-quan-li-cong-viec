import React, { Suspense } from "react";
import TaskTable from "./taskTable";

export default function Task() {
  return (
    <Suspense>
      <TaskTable />
    </Suspense>
  );
}
