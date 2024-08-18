"use client";
import { useEthereumBalance, useEthereumPrice } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import { Group, Loader, Stack, Text } from "@mantine/core";

export const CardHeader = () => {
  const { user } = useUser();
  const { ethereumBalance, isLoadingEthereumBalance } = useEthereumBalance();
  const { ethereumPrice } = useEthereumPrice();

  const ethereumAddress = user?.publicMetadata?.ethereumPublicAddress;

  const truncatedEthereumAddress =
    ethereumAddress &&
    `${ethereumAddress.slice(0, 8)}...${ethereumAddress.slice(-8)}`;

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="16px" fw={700}>
          Ethereum Price
        </Text>
        <Text size="16px">
          {ethereumPrice?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Group>
      <Group justify="space-between">
        <Text size="16px" fw={700}>
          Ethereum Balance
        </Text>
        {isLoadingEthereumBalance ? (
          <Loader color="blue" size="16px" />
        ) : (
          <Text size="16px">{Number(ethereumBalance).toFixed(6)} ETH</Text>
        )}
      </Group>
      <Group justify="space-between">
        <Text size="16px" fw={700}>
          Ethereum Address
        </Text>
        <Text size="16px">
          {ethereumAddress ? (
            truncatedEthereumAddress
          ) : (
            <Loader color="blue" size="16px" />
          )}
        </Text>
      </Group>
    </Stack>
  );
};
