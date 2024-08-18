"use client";
import { CardBody } from "@/components/CardBody";
import { CardHeader } from "@/components/CardHeader";
import { useUser } from "@clerk/nextjs";
import { Card, Center, Loader, Stack } from "@mantine/core";
import { useEffect } from "react";

export const ExchangeCard = () => {
  const { user, isLoaded } = useUser();

  // if the webhook is not completed before the component renders,
  // we need to intermittently check for the generated ethereum address
  useEffect(() => {
    const interval = setInterval(() => {
      if (!user?.publicMetadata?.ethereumPublicAddress) {
        user?.reload();
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [user]);

  if (!isLoaded) {
    return (
      <Center h="100%">
        <Loader color="blue" size="xl" />
      </Center>
    );
  }

  return (
    <Card shadow="sm" px="64" pt="48" pb="32" radius="md" withBorder miw={350}>
      <Stack>
        <CardHeader />
        <CardBody />
      </Stack>
    </Card>
  );
};
