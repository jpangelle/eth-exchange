"use server";
import { plaidConfiguration, vMainnet } from "@/configs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { PlaidApi } from "plaid";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function exchangePublicToken(publicToken: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const plaidClient = new PlaidApi(plaidConfiguration);

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
}

export async function buyEthereum(amountETH: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

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
      value: parseUnits(amountETH, 18),
    });
  }

  return {
    success: true,
  };
}
