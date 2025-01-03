"use client";

import {
  ApiHeaderType,
  ApiMethod,
  APIRoute,
  AppRoutes,
  CommonStringData,
  InputTypes,
  LocalKeys,
  ResponseError,
  ResponseSuccess,
  ToastPosition,
} from "@/app/utils/commonData";
import GoBackButton from "../../Components/GoBackButton";
import NotAvailText from "../../Components/NotAvailText";
import { joinMultipleStringWithSpace } from "@/app/utils/commonFunc";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddMembers() {
  const [name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [myMem, setmyMem] = useState("All");
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the ID of the member being edited
  const [userLoggedDetails, setUserLoggedDetails] = useState(null);
  const [loader, setloader] = useState(false);
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
  // useEffect(() => {
  //   // Check if user is logged in
  //   if (userLoggedDetails) {
  //     fetchMembersByAdminId(userLoggedDetails?._id);
  //   }
  // }, [userLoggedDetails]);
  // Fetch all members from the backend
  async function fetchMembers() {
    try {
      const response = await fetch(APIRoute.member);
      if (!response.ok) throw new Error(ResponseError.FetchError);
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      toast.error(ResponseError.FetchError + err.message, {
        position: ToastPosition.BottomCenter,
      });
    }
  }
  async function fetchMembersByAdminId(id) {
    try {
      const response = await fetch(APIRoute.adminMember + `?createdBy=${id}`);
      if (response?.status == 404) {
        toast.error("Members Not Found Please add some", {
          position: ToastPosition.BottomCenter,
        });
        return;
      }
      if (!response.ok) throw new Error(ResponseError.FetchError);
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      toast.error(ResponseError.FetchError + err.message, {
        position: ToastPosition.BottomCenter,
      });
    }
  }
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setloader(true);
      const url = editingId
        ? `${APIRoute.member}${editingId}`
        : APIRoute.member; // Edit if editingId is present
      const method = editingId ? ApiMethod.PUT : ApiMethod.POST; // Use PUT for edit, POST for create
      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          name,
          email: email?.toLowerCase(),
          password: Password,
          committees: [],
          createdBy: userLoggedDetails?._id,
        }),
        headers: { "Content-Type": ApiHeaderType.application_json },
      });

      if (!response.ok)
        throw new Error(
          editingId ? ResponseError.UpdateError : ResponseError.AddError
        );

      toast.success(
        editingId ? ResponseSuccess.UpdateSuccess : ResponseSuccess.AddSuccess,
        {
          position: ToastPosition.BottomCenter,
        }
      );
      setloader(false);
      setName("");
      setEmail("");
      setPassword("");
      setEditingId(null);
      fetchMembers(); // Refetch members after adding or updating
    } catch (err) {
      toast.error(err.message, { position: ToastPosition.BottomCenter });
      setloader(false);
    }
  };

  // Handle edit button click
  const handleEdit = (member) => {
    setName(member.name);
    setEmail(member.email);
    setEditingId(member._id); // Set the ID of the member being edited
  };

  // Handle delete button click
  const handleDelete = async (id: any) => {
    try {
      const response = await fetch(`${APIRoute.member}${id}`, {
        method: ApiMethod.DELETE,
        body: JSON.stringify({
          userId: userLoggedDetails?._id,
        }),
      });
      if (!response.ok) throw new Error(ResponseError.DeleteError);
      toast.success(ResponseSuccess.DeleteSuccess, {
        position: ToastPosition.BottomCenter,
      });
      fetchMembers(); // Refetch members after deletion
    } catch (err) {
      toast.error(err.message, {
        position: ToastPosition.BottomCenter,
      });
    }
  };
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem(LocalKeys.admin_token);
    if (!token) {
      router.push(AppRoutes.adminLogin); // Redirect to login page if no token
    } else {
    }
  }, []);

  return (
    <div className="container mt-[100px] mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <GoBackButton />
        <h1 className="text-3xl font-semibold text-gray-800">
          {editingId
            ? joinMultipleStringWithSpace([
                CommonStringData.Edit,
                CommonStringData.Member,
              ])
            : joinMultipleStringWithSpace([
                CommonStringData.Add,
                CommonStringData.Member,
              ])}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label
            htmlFor={CommonStringData.Name}
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            {joinMultipleStringWithSpace([
              CommonStringData.Member,
              CommonStringData.Name,
            ])}
          </label>
          <input
            type={InputTypes.text}
            name={CommonStringData.Name}
            placeholder="Enter member's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor={CommonStringData.Password}
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            {joinMultipleStringWithSpace([
              CommonStringData.Member,
              CommonStringData.Password,
            ])}
          </label>
          <input
            type={InputTypes.password}
            name={CommonStringData.Password}
            placeholder="Enter member's password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={editingId ? true : false}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!editingId}
          />
        </div>

        <div>
          <label
            htmlFor={CommonStringData.Email}
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            {joinMultipleStringWithSpace([
              CommonStringData.Member,
              CommonStringData.Email,
            ])}
          </label>
          <input
            type={InputTypes.email}
            name={CommonStringData.Email}
            placeholder="Enter member's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type={InputTypes.submit}
          disabled={loader}
          className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-400"
        >
          {editingId
            ? joinMultipleStringWithSpace([
                CommonStringData.Edit,
                CommonStringData.Member,
              ])
            : joinMultipleStringWithSpace([
                CommonStringData.Add,
                CommonStringData.Member,
              ])}
          {loader && " in progress..."}
        </button>
      </form>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {joinMultipleStringWithSpace([
          CommonStringData.Existing,
          CommonStringData.Member,
        ])}
      </h2>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setmyMem("All");
            fetchMembers();
          }}
          className={`${myMem == "All" && "bg-green-500"} ${
            myMem == "All" && "text-white"
          } text-black px-4 py-2 rounded-lg hover:bg-green-600`}
        >
          {"All Members"}
        </button>
        <button
          onClick={() => {
            setmyMem("Ex");
            fetchMembersByAdminId(userLoggedDetails?._id);
          }}
          className={`${myMem == "Ex" && "bg-green-500"} ${
            myMem == "Ex" && "text-white"
          } px-4 py-2 rounded-lg hover:bg-green-600`}
        >
          {"See My Members"}
        </button>
      </div>

      <div className="space-y-6">
        {members && members.length === 0 ? (
          <NotAvailText text="No Members available yet!" />
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">{member.name}</p>
                <p className="text-gray-600">{member.email}</p>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={
                    member?.createdBy == userLoggedDetails?._id ? false : true
                  }
                  onClick={() => handleEdit(member)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-slate-400"
                >
                  {CommonStringData.Edit}
                </button>
                <button
                  disabled={
                    member?.createdBy == userLoggedDetails?._id ? false : true
                  }
                  onClick={() => handleDelete(member._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-slate-400"
                >
                  {CommonStringData.Delete}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
