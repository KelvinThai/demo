import {
  Flex,
  HStack,
  Text,
  StackProps,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useMediaQuery, 
} from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../reduxs/hooks";
import { numberFormat, showSortAddress } from "../utils";

export interface IProps extends StackProps {}

const WalletInformation = ({ ...props }: IProps) => {
  const { walletInfo } = useAppSelector((state) => state.account);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  if (isLargerThan1280) {
    return (
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton isActive={isOpen} as={Button} bgColor="bg.primary">
              {showSortAddress(walletInfo.address)}
            </MenuButton>
            <MenuList>
              <MenuItem justifyContent="space-between">
                BNB:{" "}
                <Text variant="dmSan" ml="20px">
                  {" "}
                  {numberFormat(walletInfo.bnbBalance)}
                </Text>
              </MenuItem>
              <MenuItem justifyContent="space-between">
                IPT:{" "}
                <Text variant="dmSan" ml="20px">
                  {" "}
                  {numberFormat(walletInfo.iptBalance)}
                </Text>
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    );
  }
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      bg="bg.primary"
      py="10px"
      mx="20px !important"
      px="20px"
      borderRadius="10px"
      fontWeight="bold"
      {...props}
    >
      <Text>{showSortAddress(walletInfo.address)}</Text>
      <Text>BNB: {numberFormat(walletInfo.bnbBalance)}</Text>
      <Text>IPT: {numberFormat(walletInfo.iptBalance)}</Text>
    </Stack>
  );
};

export default WalletInformation;
