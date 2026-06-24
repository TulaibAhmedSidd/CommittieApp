"use client";

import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function BlueTick({ verified, size = 16, className = "" }) {
    if (!verified) return null;

    return (
        <div
            className={`inline-flex items-center justify-center text-primary-600 ${className}`}
            title="Verified Identity"
        >
            <FiCheckCircle size={size} fill="currentColor" className="text-white bg-primary-600 rounded-full" />
        </div>
    );
}
