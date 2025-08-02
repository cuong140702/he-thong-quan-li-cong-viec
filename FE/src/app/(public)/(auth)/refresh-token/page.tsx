import { Suspense } from "react";
import RefreshToken from "./refresh-token";

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
