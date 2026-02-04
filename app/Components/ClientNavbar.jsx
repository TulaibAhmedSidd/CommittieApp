"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbar() {
    const pathname = usePathname();

    // Don't show the global navbar on the landing page ("/") or dashboards
    if (pathname === "/" || pathname.startsWith("/userDash") || pathname.startsWith("/admin")) return null;

    return <Navbar />;
}
