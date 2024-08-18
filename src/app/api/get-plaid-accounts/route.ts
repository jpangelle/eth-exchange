import { plaidConfiguration } from "@/configs";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PlaidApi } from "plaid";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await currentUser();

  const plaidClient = new PlaidApi(plaidConfiguration);

  if (user?.privateMetadata.plaidAccessToken) {
    const { data } = await plaidClient.accountsGet({
      access_token: user.privateMetadata.plaidAccessToken,
    });

    return NextResponse.json(data);
  }
  return NextResponse.json({}, { status: 401 });
}
