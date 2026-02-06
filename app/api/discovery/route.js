import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";
        const type = searchParams.get("type") || "all"; // committee, organizer, member
        const city = searchParams.get("city") || "";
        const lat = parseFloat(searchParams.get("lat"));
        const lng = parseFloat(searchParams.get("lng"));
        const radius = parseInt(searchParams.get("radius") || "50"); // in km

        let results = {
            committees: [],
            organizers: [],
            members: []
        };

        // Common query for text/city
        const textQuery = q ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] } : {};
        const cityQuery = city ? { city: { $regex: city, $options: "i" } } : {};

        // Geospatial query helper
        const getGeoQuery = () => {
            if (!isNaN(lat) && !isNaN(lng)) {
                return {
                    location: {
                        $near: {
                            $geometry: { type: "Point", coordinates: [lng, lat] },
                            $maxDistance: radius * 1000 // meters
                        }
                    }
                };
            }
            return {};
        };

        const verificationStatus = searchParams.get("verificationStatus");
        const minRating = parseFloat(searchParams.get("minRating") || "0");

        const geoQuery = getGeoQuery();

        if (type === "all" || type === "committee") {
            const commQuery = {
                ... (q ? { name: { $regex: q, $options: "i" } } : {}),
                status: "open"
            };
            results.committees = await Committee.find(commQuery).populate({
                path: "createdBy",
                select: "name location city verificationStatus",
                model: "Admin"
            });
        }

        if (type === "all" || type === "organizer") {
            let adminQuery = {
                ...textQuery,
                ...cityQuery,
                ...geoQuery,
                isAdmin: true,
                isSuperAdmin: false
            };
            if (verificationStatus) adminQuery.verificationStatus = verificationStatus;

            results.organizers = await Admin.find(adminQuery).select("name email city country verificationStatus location");

            // If rating filter is needed, we'd need to join with Reviews.
            // For now, simpler filtering.
        }

        if (type === "all" || type === "member") {
            results.members = await Member.find({
                ...textQuery,
                ...cityQuery,
                ...geoQuery
            }).select("name email city country verificationStatus location");
        }

        return new Response(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
