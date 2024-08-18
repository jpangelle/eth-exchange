import { getEthereumBalance } from "@/utilities";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useExchangePublicToken = () => {
  const { refetchPlaidAccounts } = usePlaidAccounts();
  const { user } = useUser();
  const {
    mutate: exchangePublicToken,
    isPending: isPendingExchangingPublicToken,
  } = useMutation({
    mutationFn: async (publicToken: string) => {
      await axios.post("/api/exchange-public-token", {
        publicToken,
      });
    },
    onSuccess: async () => {
      await user?.reload();
      await refetchPlaidAccounts();
    },
  });

  return { exchangePublicToken, isPendingExchangingPublicToken };
};

export const useBuyEthereum = (onSuccess: () => void) => {
  const {
    mutate: buyEthereum,
    isPending: isBuyingEthereum,
    isSuccess,
  } = useMutation({
    mutationFn: async (amount: string) => {
      await axios.post("/api/buy-ethereum", {
        amount,
      });
    },
    onSuccess,
  });

  return { buyEthereum, isBuyingEthereum, isSuccess };
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
