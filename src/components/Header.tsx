"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Group } from "@mantine/core";
import Link from "next/link";

export const Header = () => {
  return (
    <Group p="md" align="center" justify="flex-end" h="100%">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </SignedOut>
    </Group>
  );
};
