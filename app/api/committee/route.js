import connectToDatabase from "../../utils/db";
import Committee from "../models/Committee";
import Admin from "../models/Admin";
import Member from "../models/Member";
import { createLog } from "../../utils/logger";

// Handle GET requests (fetch all committees)
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  try {
    let query = {};
    if (adminId) {
      const requester = await Admin.findById(adminId);
      // If requester is NOT super admin, filter by createdBy
      if (!requester?.isSuperAdmin) {
        query = { createdBy: adminId };
      }
    }
    const committees = await Committee.find(query)
      .populate({
        path: "members",
        model: "Member",
      })
      .populate({
        path: "result.member",
        model: "Member",
      })
      .populate({
        path: "pendingMembers",
        model: "Member",
      })
      .populate({
        path: "createdBy",
        model: "Admin",
      });
    const committeesWithDetails = committees.map((committee) => ({
      ...committee.toObject(),
      createdBy: committee.createdBy?._id,
      adminDetails: {
        name: committee.createdBy?.name || "",
        email: committee.createdBy?.email || "",
      },
    }));
    return new Response(JSON.stringify(committeesWithDetails), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch committees", details: err.message }),
      { status: 500 }
    );
  }
}

// Handle POST requests (create a new committee)
export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      name,
      description,
      maxMembers,
      monthlyAmount,
      monthDuration,
      startDate,
      createdBy,
      bankDetails,
      organizerFee,
      isFeeMandatory,
    } = body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !maxMembers ||
      !monthlyAmount ||
      !monthDuration ||
      !startDate ||
      !createdBy
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    if (maxMembers <= 0 || monthlyAmount <= 0 || monthDuration <= 0) {
      return new Response(
        JSON.stringify({ error: "Values must be greater than zero." }),
        { status: 400 }
      );
    }

    // Calculate endDate and totalAmount
    const calculatedEndDate = new Date(startDate);
    calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthDuration);
    const totalAmount = monthlyAmount * monthDuration;

    // Create a new committee
    const newCommittee = new Committee({
      name,
      description,
      maxMembers,
      monthlyAmount,
      monthDuration,
      startDate,
      endDate: calculatedEndDate.toISOString().split("T")[0],
      totalAmount,
      createdBy,
      bankDetails,
      organizerFee: organizerFee || 0,
      isFeeMandatory: isFeeMandatory || false,
    });

    await newCommittee.save();

    await createLog({
      action: "CREATE_COMMITTEE",
      performedBy: createdBy,
      onModel: "Admin",
      targetId: newCommittee._id,
      details: { name: newCommittee.name },
    });

    return new Response(JSON.stringify(newCommittee), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to create committee",
        details: err.message,
      }),
      { status: 400 }
    );
  }
}

// Handle PATCH requests (update a committee)
export async function PATCH(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      id,
      name,
      description,
      maxMembers,
      status,
      monthlyAmount,
      monthDuration,
      startDate,
      createdBy,
      bankDetails,
    } = body;

    if (!id || !createdBy) {
      return new Response(
        JSON.stringify({ error: "Committee ID and createdBy are required." }),
        { status: 400 }
      );
    }

    const committee = await Committee.findById(id);
    const requester = await Admin.findById(createdBy);

    if (!committee || (committee.createdBy?.toString() !== createdBy.toString() && !requester?.isSuperAdmin)) {
      return new Response(
        JSON.stringify({
          error: "You are not authorized to update this committee.",
        }),
        { status: 403 }
      );
    }

    const updatedFields = {
      name,
      description,
      maxMembers,
      status,
      monthlyAmount,
      monthDuration,
      startDate,
      bankDetails,
    };

    if (startDate && monthDuration) {
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthDuration);
      updatedFields.endDate = calculatedEndDate.toISOString().split("T")[0];
    }

    if (monthlyAmount && monthDuration) {
      updatedFields.totalAmount = monthlyAmount * monthDuration;
    }

    const updatedCommittee = await Committee.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (!updatedCommittee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    await createLog({
      action: "UPDATE_COMMITTEE",
      performedBy: createdBy,
      onModel: "Admin",
      targetId: updatedCommittee._id,
      details: { status: updatedCommittee.status },
    });

    return new Response(JSON.stringify(updatedCommittee), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to update committee",
        details: err.message,
      }),
      { status: 400 }
    );
  }
}

// Handle DELETE requests (delete a committee)
export async function DELETE(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { id, createdBy } = body;

    if (!id || !createdBy) {
      return new Response(
        JSON.stringify({ error: "Committee ID and createdBy are required." }),
        { status: 400 }
      );
    }

    const committee = await Committee.findById(id);
    const requester = await Admin.findById(createdBy);

    if (!committee || (committee.createdBy?.toString() !== createdBy.toString() && !requester?.isSuperAdmin)) {
      return new Response(
        JSON.stringify({ error: "You are not authorized to delete this committee." }),
        { status: 403 }
      );
    }

    const deletedCommittee = await Committee.findByIdAndDelete(id);

    if (!deletedCommittee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    await createLog({
      action: "DELETE_COMMITTEE",
      performedBy: createdBy,
      onModel: "Admin",
      targetId: id,
      details: { name: committee.name },
    });

    return new Response(
      JSON.stringify({ message: "Committee deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to delete committee", details: err.message }),
      { status: 400 }
    );
  }
}
