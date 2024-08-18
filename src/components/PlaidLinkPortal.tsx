"use client";
import { useExchangePublicToken, usePlaidLinkToken } from "@/hooks";
import { Button, Center, Loader } from "@mantine/core";
import { usePlaidLink } from "react-plaid-link";

export const PlaidLinkPortal = () => {
  const { exchangePublicToken, isPendingExchangingPublicToken } =
    useExchangePublicToken();

  const { linkToken } = usePlaidLinkToken();

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken: string) => {
      exchangePublicToken(publicToken);
    },
  });

  if (isPendingExchangingPublicToken) {
    return (
      <Center py="16">
        <Loader color="blue" size="md" />
      </Center>
    );
  }

  return (
    <Button w="100%" onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </Button>
  );
};
