import React from 'react'

const AdminGuide = () => {
    return (
        <div className=" p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Admin/Organizer Guide</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-lg">Step 1: Manage Admin Users</h3>
                    <p className="text-gray-600">
                        To manage the system, you must have admin privileges. You can create new admins or manage existing ones from the "Admin Users" section.
                    </p>
                </div>
                <div>
                    <h3 className="font-medium text-lg">Step 2: Add/View Members</h3>
                    <p className="text-gray-600">
                        Admins can add new members, view existing members, and edit or delete them from the "Members" section.
                    </p>
                </div>
                <div>
                    <h3 className="font-medium text-lg">Step 3: Create and Manage Committees</h3>
                    <p className="text-gray-600">
                        You can create committees, assign members to them, and manage their approval status from the "Committees" section.
                    </p>
                </div>
                <div>
                    <h3 className="font-medium text-lg">Step 4: Announce Committee Results</h3>
                    <p className="text-gray-600">
                        Once a committee is ready, you can announce the results (ranked members) from the "Announcements" section.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminGuide