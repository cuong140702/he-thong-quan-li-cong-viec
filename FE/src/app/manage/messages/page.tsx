import { Suspense } from "react";
import MessagesList from "./MessagesList";

export default function MessagePage() {
  return (
    <Suspense>
      <MessagesList />
    </Suspense>
  );
}
