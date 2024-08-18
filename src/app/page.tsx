import { ExchangeCard } from "@/components/ExchangeCard";
import {
  createLinkToken,
  getEthereumBalance,
  getEthereumPrice,
  getPlaidAccounts,
} from "@/utilities";
import { currentUser } from "@clerk/nextjs/server";
import { Center, Stack } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  const queryClient = new QueryClient();

  if (!user) {
    redirect("/sign-up");
  }

  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["link-token"],
      queryFn: () => createLinkToken(user.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["ethereum-price"],
      queryFn: () => getEthereumPrice(),
    }),
    queryClient.fetchQuery({
      queryKey: ["ethereum-balance"],
      queryFn: () =>
        getEthereumBalance(user.publicMetadata.ethereumPublicAddress),
    }),
    ...(user.publicMetadata.isPlaidLinked
      ? [
          queryClient.fetchQuery({
            queryKey: ["plaid-accounts"],
            queryFn: () =>
              getPlaidAccounts(user.privateMetadata.plaidAccessToken!),
          }),
        ]
      : []),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack h="100%">
        <Center h="100%">
          <ExchangeCard />
        </Center>
      </Stack>
    </HydrationBoundary>
  );
}
