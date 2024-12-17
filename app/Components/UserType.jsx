'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const UserType = () => {
    const router = useRouter()
    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-6">Login As A</h1>
            <button
                onClick={() => {
                    router?.push('/userDash')
                }}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mb-2 rounded w-full hover:bg-blue-600"
            >
                Committie Member
            </button>
            <button
                onClick={() => {
                    router?.push('/admin')
                }}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mb-2 rounded w-full hover:bg-blue-600"
            >
                Admin
            </button>
        </div>
    )
}

export default UserType