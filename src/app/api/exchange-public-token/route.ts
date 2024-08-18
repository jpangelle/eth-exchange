import { plaidConfiguration } from "@/configs";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PlaidApi } from "plaid";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const plaidClient = new PlaidApi(plaidConfiguration);

  const { publicToken } = await request.json();

  const { data } = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const { access_token: accessToken } = data;

  await clerkClient().users.updateUserMetadata(userId, {
    publicMetadata: {
      isPlaidLinked: true,
    },
    privateMetadata: {
      plaidAccessToken: accessToken,
    },
  });

  return NextResponse.json({}, { status: 200 });
}
