'use client'
import { useRouter } from 'next/navigation';
import React from 'react';

const HowItWorks = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h1>

                {/* Steps Section */}
                <div className="space-y-10">
                    {/* Step 1 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                            1
                        </div>
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold text-gray-800">Explore Committees</h2>
                            <p className="text-gray-600">
                                Browse through a variety of available committees. View details like member limits, approved members, and committee descriptions to find the perfect fit.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                            2
                        </div>
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold text-gray-800">Join a Committee</h2>
                            <p className="text-gray-600">
                                Register for your chosen committee. Your application will be reviewed and approved by the Committee Organizer.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-yellow-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                            3
                        </div>
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold text-gray-800">Approval Process</h2>
                            <p className="text-gray-600">
                                The Committee Organizer reviews your application and updates your status. Approved members are added to the committee.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-purple-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                            4
                        </div>
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold text-gray-800">Stay Updated</h2>
                            <p className="text-gray-600">
                                Get announcements, updates, and results directly on your dashboard. Stay informed about your committee's progress.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Organizer Section */}
                <div className="mt-16 bg-blue-50 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Become a Committee Organizer</h2>
                    <p className="text-center text-gray-600">
                        Start your own committee, manage members, and make a difference. Create a collaborative and transparent platform for everyone!
                    </p>
                    <div className="flex justify-center mt-6">
                        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
                            onClick={() => router.push('/adminLogin')}
                            >
                            Get Started 
                        </button>
                    </div>
                </div>
                {/* Member Login Section */}
                <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Want to Log In as a Member?</h2>
                    <p className="text-center text-gray-600">
                        Access your dashboard, manage your committees, and stay informed about all the updates.
                    </p>
                    <div className="flex justify-center mt-6">
                        <button
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                            onClick={() => router.push('/userDash')}
                        >
                            Log In as Member
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
