"use client";

import React from "react";

export default function StepProgress({ steps = [], currentStep = 0 }) {
    return (
        <div className="w-full py-4 px-2">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-100 dark:bg-border-200 -translate-y-1/2 -z-10" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 transition-all duration-300 -z-10"
                    style={{ width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? "bg-primary-500 border-primary-500 text-white" : ""}
                  ${isActive ? "bg-surface-50 dark:bg-surface-100 border-primary-500 text-primary-600 shadow-md" : ""}
                  ${!isCompleted && !isActive ? "bg-surface-50 dark:bg-surface-100 border-border-100 dark:border-border-200 text-muted-500" : ""}
                `}
                            >
                                {isCompleted ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span className="font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`mt-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300
                  ${isActive || isCompleted ? "text-primary-600 dark:text-primary-300" : "text-muted-500"}
                `}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
