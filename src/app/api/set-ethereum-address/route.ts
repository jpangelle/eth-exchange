import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const webhookSecret = process.env.WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const sivx = new Webhook(webhookSecret);

  const svix_id = request.headers.get("svix-id") ?? "";
  const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
  const svix_signature = request.headers.get("svix-signature") ?? "";

  const data = await request.json();

  try {
    sivx.verify(JSON.stringify(data), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch {
    return NextResponse.json({}, { status: 401 });
  }

  const account = privateKeyToAccount(generatePrivateKey());

  const user = await clerkClient().users.getUser(data.data.id);

  if (!user.publicMetadata.ethereumPublicAddress) {
    await clerkClient().users.updateUserMetadata(data.data.id, {
      publicMetadata: {
        ethereumPublicAddress: account.address,
      },
    });
  }

  return NextResponse.json({ status: 200 });
}
