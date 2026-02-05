"use client";

import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function BlueTick({ verified, size = 16, className = "" }) {
    if (!verified) return null;

    return (
        <div
            className={`inline-flex items-center justify-center text-blue-500 ${className}`}
            title="Verified Identity"
        >
            <FiCheckCircle size={size} fill="currentColor" className="text-white bg-blue-500 rounded-full" />
        </div>
    );
}
