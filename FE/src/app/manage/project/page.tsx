import { http } from "@/utils/api";
import React, { Suspense } from "react";
import ProjectTable from "./projectTable";

export default function Project() {
  return (
    <Suspense>
      <ProjectTable />
    </Suspense>
  );
}
