"use client";
import { exchangePublicToken } from "@/actions";
import { usePlaidLinkToken } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import { Button, Center, Loader } from "@mantine/core";
import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export const PlaidLinkPortal = () => {
  const [isPendingExchangingPublicToken, setIsPendingExchangingPublicToken] =
    useState(false);

  const { user } = useUser();
  const { linkToken } = usePlaidLinkToken();
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken: string) => {
      setIsPendingExchangingPublicToken(true);
      await exchangePublicToken(publicToken);
      await user?.reload();
      setIsPendingExchangingPublicToken(false);
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
