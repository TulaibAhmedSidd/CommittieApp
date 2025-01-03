'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { checkerForAddAdmin } from '@/app/utils/commonFunc';

export default function AdminTabs() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    let detail = null;
    if (typeof window !== "undefined") {
        detail = localStorage.getItem("admin_detail");
    }
    useEffect(() => {
        // Check if user is logged in
        if (detail) {
            setUserLoggedDetails(JSON.parse(detail));
        }
    }, [detail]);

    const adminChecker = checkerForAddAdmin(userLoggedDetails);
    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
              <h1 className=" hidden sm:block text-xl font-semibold text-gray-800 cursor-pointer w-full text-center py-2"
                    onClick={() => router.push('/admin')}
                >Admin Dashboard</h1>
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-2 py-3">
                {/* Dashboard Title */}
                <h1 className=" block sm:hidden text-xl font-semibold text-gray-800 cursor-pointer"
                    onClick={() => router.push('/admin')}
                >Admin Dashboard</h1>

                {/* Hamburger Menu for Small Screens */}
                <button
                    className="lg:hidden text-gray-800 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    )}
                </button>

                {/* Navigation Links */}
                <nav
                    className={`${isMenuOpen ? 'block' : 'hidden'
                        } lg:flex lg:items-center lg:space-x-4 absolute lg:relative bg-white lg:bg-transparent w-full lg:w-auto left-0 top-full lg:top-0 px-4 lg:px-0 border border-b-2 md:border-none`}
                >
                    {
                        adminChecker &&
                        <Link href="/admin/add-admin">
                            <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline">
                                Create Organizer
                            </p>
                        </Link>
                    }
                    <Link href="/admin/create">
                        <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline">
                            Create Committee
                        </p>
                    </Link>
                    <Link href="/admin/members">
                        <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline">
                            View/ Manage Members in Committee
                        </p>
                    </Link>
                    <Link href="/admin/assign-member">
                        <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline">
                            Assign Committee to a Member
                        </p>
                    </Link>
                    <Link href="/admin/addmember">
                        <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline">
                            Add Member
                        </p>
                    </Link>
                    <Link href="/admin/announcement">
                        <p onClick={()=>{setIsMenuOpen(false)}} className="block lg:inline-block text-blue-600 py-2 px-4 hover:text-blue-700 hover:underline pb-2">
                            Announcements
                        </p>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
