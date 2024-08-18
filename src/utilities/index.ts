import { plaidConfiguration, publicClient } from "@/configs";
import axios from "axios";
import { CountryCode, PlaidApi, Products } from "plaid";
import { formatEther } from "viem";

export const createLinkToken = async (userId: string) => {
  const plaidClient = new PlaidApi(plaidConfiguration);

  const { data } = await plaidClient.linkTokenCreate({
    user: {
      client_user_id: userId,
    },
    client_name: "Ethereum Exchange",
    products: [Products["Auth"], Products["Transactions"]],
    country_codes: [CountryCode["Us"]],
    language: "en",
  });

  return data.link_token;
};

export const getEthereumPrice = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum"
  );

  return data.ethereum.usd;
};

export const getEthereumBalance = async (
  ethereumAddress: `0x${string}` | undefined
) => {
  if (ethereumAddress) {
    const balance = await publicClient.getBalance({
      address: ethereumAddress,
    });
    return formatEther(balance);
  }
};

export const getPlaidAccounts = async (plaidAccessToken: string) => {
  const plaidClient = new PlaidApi(plaidConfiguration);

  if (plaidAccessToken) {
    const { data } = await plaidClient.accountsGet({
      access_token: plaidAccessToken,
    });

    return data.accounts;
  }
};
