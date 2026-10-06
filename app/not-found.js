"use client";

import { FiHome } from "react-icons/fi";
import PublicLayout from "@/app/ui/PublicLayout";
import { Bi, Button, Card } from "@/app/ui";

export default function NotFound() {
  return (
    <PublicLayout narrow>
      <Card padding="p-6" className="text-center">
        <h1 className="text-2xl font-bold text-ink-900">
          <Bi en="Page not found" ur="صفحہ نہیں ملا" stack />
        </h1>
        <p className="mt-2 text-ink-600">This link may be old or typed wrong.</p>
        <Button href="/" size="lg" full icon={FiHome} className="mt-5">
          <Bi en="Go to home" ur="ہوم پر جائیں" />
        </Button>
      </Card>
    </PublicLayout>
  );
}
