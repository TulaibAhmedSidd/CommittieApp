'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const GoBackButton = ({ onClick = () => { } }) => {
    const router = useRouter()
    return (

        <button
            onClick={() => {
                onClick()
                router?.back();
            }}
            className="border border-transparent text-slate-700 py-2 px-4 rounded hover:bg-slate-200 hover:border-slate-700"
        >
            ⇐ Go Back
        </button>
    )
}

export default GoBackButton