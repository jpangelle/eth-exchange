import { vMainnet } from "@/configs";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const { amount } = await request.json();

  const user = await clerkClient().users.getUser(userId);

  const funderAccount = privateKeyToAccount(process.env.FUNDER_PRIVATE_KEY);

  const walletClient = createWalletClient({
    account: funderAccount,
    chain: vMainnet,
    transport: http(),
  });

  if (user?.publicMetadata?.ethereumPublicAddress) {
    await walletClient.sendTransaction({
      account: funderAccount,
      to: user.publicMetadata.ethereumPublicAddress,
      value: parseUnits(amount, 18),
    });
  }

  return NextResponse.json({}, { status: 200 });
}
