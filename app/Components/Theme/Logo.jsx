"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
  urduSub = true,
}) {
  const sizeMap = {
    sm: { icon: 32, text: "text-base", sub: "text-[10px]" },
    md: { icon: 40, text: "text-xl", sub: "text-[11px]" },
    lg: { icon: 52, text: "text-2xl", sub: "text-xs" },
    xl: { icon: 64, text: "text-3xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Clean SVG Logo Icon */}
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/images/committie_logo.svg"
          alt="CommittieApp Shield Logo"
          width={currentSize.icon}
          height={currentSize.icon}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="leading-none">
          <p className={`${currentSize.text} font-black tracking-tighter text-slate-900 dark:text-white`}>
            Committie<span className="text-primary-600">App</span>
          </p>
          {urduSub && (
            <p className={`font-urdu ${currentSize.sub} text-slate-500 dark:text-slate-400 mt-0.5`} dir="rtl">
              بھروسے کی بی سی
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
