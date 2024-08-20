"use client";
import { buyEthereum } from "@/actions";
import {
  useEthereumBalance,
  useEthereumPrice,
  usePlaidAccounts,
} from "@/hooks";
import {
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AccountBase } from "plaid";
import { useActionState, useEffect } from "react";

export const formatAmount = (value: string) => {
  const formattedValue = value.replace(/,/g, "");
  const parts = formattedValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const ExchangeForm = () => {
  const { bankAccounts } = usePlaidAccounts();

  const { refetchEthereumBalance } = useEthereumBalance();

  const [formState, formAction, isBuyingEthereum] = useActionState<
    { success: boolean },
    string
  >((_, amountETH) => buyEthereum(amountETH), {
    success: false,
  });

  const { ethereumPrice } = useEthereumPrice();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      amountUSD: "",
      amountETH: "",
      account: "",
    },
    validate: {
      amountUSD: (value, values) => {
        const valueNoCommas = Number(value.replaceAll(",", ""));

        if (!values.account) return null;
        if (valueNoCommas <= 0) return "Value must be greater than 0";
        if (
          Number(valueNoCommas) >
          (
            bankAccounts.find(
              (account) => account.persistent_account_id === values.account,
            ) as AccountBase
          ).balances.available!
        )
          return "Insufficient funds";
        return null;
      },
      amountETH: (value, values) => {
        const valueNoCommas = Number(value.replaceAll(",", ""));

        if (!values.account) return null;
        if (valueNoCommas <= 0) return "Value must be greater than 0";
        return null;
      },
      account: (value) => (value ? null : "Account is required"),
    },
  });

  useEffect(() => {
    if (formState?.success) {
      refetchEthereumBalance();
      form.setValues({
        amountUSD: "",
        amountETH: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  if (!bankAccounts?.length) {
    return (
      <Center py="16">
        <Loader color="blue" size="md" />
      </Center>
    );
  }

  return (
    <>
      <form action={() => formAction(form.values.amountETH)}>
        <Stack gap="12">
          <Select
            label="Bank account"
            placeholder="Account"
            data={bankAccounts.map((account) => ({
              value: account.persistent_account_id!,
              label: account.name,
              availableBalance: account.balances.available,
            }))}
            renderOption={({ option }) => {
              const { availableBalance, label } = option as unknown as {
                availableBalance: string;
                label: string;
              };
              return (
                <Group flex="1" justify="space-between">
                  <Text>{label}</Text>
                  <Text>${availableBalance}</Text>
                </Group>
              );
            }}
            {...form.getInputProps("account")}
          />
          <TextInput
            label="Sell"
            placeholder="123.45"
            key={form.key("amountUSD")}
            rightSection={
              <Text size="sm" mr="md">
                USD
              </Text>
            }
            {...form.getInputProps("amountUSD")}
            onChange={(event) => {
              form.setValues({
                amountUSD: formatAmount(event.target.value),
                amountETH: event.target.value
                  ? formatAmount(
                      (
                        Number(event.target.value.replaceAll(",", "")) /
                        ethereumPrice!
                      ).toFixed(8),
                    )
                  : "",
              });
            }}
            value={form.values.amountUSD}
            disabled={!form.values.account}
          />
          <TextInput
            label="Buy"
            placeholder="0.123"
            key={form.key("amountETH")}
            rightSection={
              <Text size="sm" mr="md">
                ETH
              </Text>
            }
            {...form.getInputProps("amountETH")}
            onChange={(event) => {
              form.setValues({
                amountUSD: event.target.value
                  ? formatAmount(
                      (
                        Number(event.target.value.replaceAll(",", "")) *
                        ethereumPrice!
                      ).toFixed(2),
                    )
                  : "",
                amountETH: formatAmount(event.target.value),
              });
            }}
            value={form.values.amountETH}
            disabled={!form.values.account}
          />
        </Stack>

        <Flex justify="flex-end">
          <Button type="submit" mt="sm" loading={isBuyingEthereum}>
            Submit
          </Button>
        </Flex>
      </form>
      {formState?.success &&
        !form.values.amountETH &&
        !form.values.amountUSD && (
          <Center>
            <Text>Your purchase was successful!</Text>
          </Center>
        )}
    </>
  );
};
