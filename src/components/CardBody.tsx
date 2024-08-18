"use client";
import { ExchangeForm } from "@/components/ExchangeForm";
import { PlaidLinkPortal } from "@/components/PlaidLinkPortal";
import { useUser } from "@clerk/nextjs";

export const CardBody = () => {
  const { user } = useUser();

  if (user?.publicMetadata.isPlaidLinked) {
    return <ExchangeForm />;
  }

  return <PlaidLinkPortal />;
};
