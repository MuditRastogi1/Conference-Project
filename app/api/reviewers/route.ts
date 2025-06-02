import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const usersResponse = await clerkClient.users.getUserList();
    const users = usersResponse.data; // <-- get the array of users
    const reviewers = users
      .filter((user: any) => user.publicMetadata?.role === "reviewer")
      .map((user: any) => ({
        id: user.id,
        name:
          (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username) ||
          user.emailAddresses?.[0]?.emailAddress ||
          "Unnamed Reviewer",
      }));
    return NextResponse.json(reviewers);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}