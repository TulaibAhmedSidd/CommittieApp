'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCommittees, deleteCommittee } from './apis';
import { useRouter } from 'next/navigation';
import NotAvailText from "@/app/Components/NotAvailText";
import { checkArrNull, formatMoney } from "@/app/utils/commonFunc";
import AdminTabs from "./AdminComponents/AdminTabs";
import Spinner from './AdminComponents/Spinner';
import AdminGuide from './AdminComponents/AdminGuide';
import { CommonData } from '../utils/data';
import moment from 'moment';


export default function Committiee() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  const [userLoggedDetails, setUserLoggedDetails] = useState(null);

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

  return (
    <div className="p-8 bg-transparent min-h-screen">
      <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <h1 className="text-xl md:text-3xl font-bold text-white">Committee Organizer Dashboard</h1>
        <button
          onClick={() => {
            localStorage?.clear();
            setTimeout(() => {
              localStorage.clear()
              router.push('/admin/login');
              router.refresh();
            }, 800);
          }}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200 transform hover:scale-105"
        >
          Logout
        </button>
      </div>


      <AdminGuide />

      {/* Committees List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-9">Showing All Committees</h2>
        <ul className="space-y-12 ">
          {checkArrNull(committees) ? (
            <NotAvailText text="No Committees available yet!" />
          ) : (
            committees.map((committee) => (
              <li
                key={committee._id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative "
              >
                {/* Max Members */}
                <div className="absolute top-[-30px] left-4 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                  Created by Organizer: {committee?.adminDetails?.name}
                </div>
                <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                  Max Members: {committee.maxMembers}
                </div>

                {/* Committee Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{committee.name}</h3>
                  <p className="text-gray-600">{committee.description}</p>
                </div>

                {/* Date Box */}
                <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-lg font-bold text-gray-700">{moment(committee.startDate).format('MMMM YYYY')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="text-lg font-bold text-gray-700">{moment(committee.endDate).format('MMMM YYYY')}</p>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200 mb-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-gray-500">Monthly Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      PKR. {formatMoney(committee.monthlyAmount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-700">
                      PKR. {formatMoney(committee.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/edit?id=${committee._id}`}>
                    <button
                      disabled={
                        committee?.createdBy == userLoggedDetails?._id ? false : true
                      }
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition duration-200 disabled:bg-slate-400">
                      Edit
                    </button>
                  </Link>
                  <button
                    disabled={
                      committee?.createdBy == userLoggedDetails?._id ? false : true
                    }
                    onClick={() => handleDelete(committee._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-200 disabled:bg-slate-400"
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