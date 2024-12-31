'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCommittees, deleteCommittee } from './apis';
import { useRouter } from 'next/navigation';
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull } from "@/app/utils/commonFunc";
import AdminTabs from "./AdminComponents/AdminTabs";
import Spinner from './AdminComponents/Spinner';
import AdminGuide from './AdminComponents/AdminGuide';


export default function Committiee() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setUserLoggedIn(false);
      router.push("/admin/login");  // Redirect to login page if no token
    } else {
      setUserLoggedIn(true);
      fetchCommittees();
    }
  }, []);

  useEffect(() => {
    async function loadCommittees() {
      try {
        const data = await fetchCommittees();
        setCommittees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCommittees();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this committee?')) return;
    try {
      await deleteCommittee(id);
      setCommittees(committees.filter((committee) => committee._id !== id));
    } catch (err) {
      alert('Failed to delete committee');
    }
  };

  if (loading) return <Spinner />
  if (error) return <p className="text-red-500">Error: {error}</p>;
  // If the user is not logged in, they are redirected to the login page
  if (!userLoggedIn) {
    return <div>Redirecting to admin login...</div>;
  }
  //   return (
  //     <div className="p-6">
  //       <div className="flex justify-between items-center mb-6">
  //         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
  //         <button
  //           onClick={() => {
  //             localStorage?.clear();
  //             router.push('/admin/login')
  //             router.refresh()
  //           }}
  //           className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-600">
  //           Logout
  //         </button>
  //       </div>
  //       <div className='flex gap-1 my-2 flex-wrap'>
  //         <Link href="/admin/add-admin">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             Create New Admin
  //           </button>
  //         </Link>
  //         <Link href="/admin/create">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             Create New Committee
  //           </button>
  //         </Link>
  //         <Link href="/admin/members">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             View Members in a Committie
  //           </button>
  //         </Link>
  //         <Link href="/admin/assign-member">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             Assign Committie to a Member
  //           </button>
  //         </Link>
  //         <Link href="/admin/addmember">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             Add a Member
  //           </button>
  //         </Link>
  //         <Link href="/admin/announcement">
  //           <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //             Announcement
  //           </button>
  //         </Link>
  //       </div>
  //       <div className="flex justify-between items-center my-6">
  //         <h1 className="text-2xl  font-semibold ">Showing All Committies</h1>

  //       </div>
  //       <ul className="space-y-4">
  //         {
  //           checkArrNull(committees) ? (
  //             <NotAvailText text="No Committies available yet!" />
  //           ) :
  //             committees.map((committee) => (
  //               <li
  //                 key={committee._id}
  //                 className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
  //               >
  //                 <div>
  //                   <h3 className="text-xl font-semibold">{committee.name}</h3>
  //                   <p>{committee.description}</p>
  //                 </div>
  //                 <div className="flex space-x-2">
  //                   <Link href={`/admin/edit?id=${committee._id}`}>
  //                     <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
  //                       Edit
  //                     </button>
  //                   </Link>
  //                   <button
  //                     onClick={() => handleDelete(committee._id)}
  //                     className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
  //                   >
  //                     Delete
  //                   </button>
  //                 </div>
  //               </li>
  //             ))}
  //       </ul>
  //     </div>
  //   );
  // }


  return (
    <div className="p-8 bg-transparent min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg md:text-4xl font-bold text-gray-800">Committee Organizer Dashboard</h1>
        <button
          onClick={() => {
            localStorage?.clear();
            router.push('/admin/login');
            router.refresh();
          }}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      <AdminGuide />



      {/* Committees List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Showing All Committees</h2>
        <ul className="space-y-6">
          {checkArrNull(committees) ? (
            <NotAvailText text="No Committees available yet!" />
          ) : (
            committees.map((committee) => (
              <li
                key={committee._id}
                className="bg-gray-100 p-6 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-700">{committee.name}</h3>
                  <p className="text-gray-600">{committee.description}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/edit?id=${committee._id}`}>
                    <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition duration-200">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(committee._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}