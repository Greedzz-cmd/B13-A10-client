import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

const selectableRoles = new Set(["traveller", "vendor"]);

export async function POST(request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return Response.json({ message: "Authentication is required." }, { status: 401 });
    }

    const { role } = await request.json().catch(() => ({}));

    if (!selectableRoles.has(role)) {
        return Response.json({ message: "Choose either traveller or vendor." }, { status: 400 });
    }

    await db.collection("user").updateOne(
        { _id: new ObjectId(session.user.id) },
        { $set: { role, roleSelected: true, updatedAt: new Date() } },
    );

    return Response.json({ role });
}
