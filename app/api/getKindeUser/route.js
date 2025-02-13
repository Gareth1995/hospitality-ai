import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Named export for the GET method
export async function GET(req) {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();
        const user = await getUser();

        if (await isAuthenticated()) {
            return new Response(JSON.stringify(user), { status: 200 });
        } else {
            return new Response(
                JSON.stringify({ message: "User not authenticated" }),
                { status: 401 }
            );
        }
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Failed to fetch user data", details: err.message }),
            { status: 500 }
        );
    }
}

