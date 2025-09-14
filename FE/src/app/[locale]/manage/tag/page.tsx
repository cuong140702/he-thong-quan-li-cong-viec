import React, { Suspense } from "react";
import TagTable from "./tagTable";

export default function Tag() {
  return (
    <Suspense>
      <TagTable />
    </Suspense>
  );
}
