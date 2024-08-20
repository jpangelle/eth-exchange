import { getEthereumBalance } from "@/utilities";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountBase } from "plaid";

export const usePlaidAccounts = () => {
  const { user } = useUser();
  const {
    data: bankAccounts,
    isFetching: isFetchingPlaidAccounts,
    refetch: refetchPlaidAccounts,
  } = useQuery<AccountBase[]>({
    queryKey: ["plaid-accounts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-plaid-accounts");
      return data.accounts;
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.publicMetadata.isPlaidLinked,
    initialData: [],
  });

  return { bankAccounts, isFetchingPlaidAccounts, refetchPlaidAccounts };
};

export const useEthereumBalance = () => {
  const { user } = useUser();
  const {
    data: ethereumBalance,
    refetch: refetchEthereumBalance,
    isLoading: isLoadingEthereumBalance,
  } = useQuery<string | undefined>({
    queryKey: ["ethereum-balance"],
    queryFn: async () =>
      getEthereumBalance(user?.publicMetadata.ethereumPublicAddress),
    refetchOnWindowFocus: false,
  });

  return { ethereumBalance, refetchEthereumBalance, isLoadingEthereumBalance };
};

export const useEthereumPrice = () => {
  const { data: ethereumPrice } = useQuery<number>({
    queryKey: ["ethereum-price"],
  });

  return { ethereumPrice };
};

export const usePlaidLinkToken = () => {
  const { data: linkToken } = useQuery<string>({
    queryKey: ["link-token"],
    initialData: "",
  });

  return { linkToken };
};
