import { HStack, Text, VStack } from "@yamada-ui/react";
import { Me } from "~/features/me/client/Me";
import { Users } from "~/features/users/client/Users";

export const HomeLayout = () => (
  <VStack>
    <HStack as="header">
      <Text as="h1">aaaa</Text>
    </HStack>
    <Me />
    <Users />
  </VStack>
);
