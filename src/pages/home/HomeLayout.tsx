import { VStack } from "@yamada-ui/react";
import { Me } from "~/features/me/client/Me";
import { Users } from "~/features/users/client/Users";

export const HomeLayout = () => (
  <VStack gap={1}>
    <Me />
  </VStack>
);
