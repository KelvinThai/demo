import { Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../../../reduxs/hooks";

interface IProps {
  name: string;
  apr: number;
  duration: number;
  onStack?: () => void;
}

export default function StakeItem({ name, apr, duration, onStack }: IProps) {
  const { walletInfo } = useAppSelector((state) => state.account);
  const color = name === "GOLD" ? "rgb(255 171 0)" : "#fff";
  return (
    <VStack
      my={{base: '10px', lg: "50px"}}
      mx={{base: "10px", lg: '40px'}}
      bg="#0E1E45"
      minH="400px"
      borderRadius="16px"
      px="46px"
      py="46px"
      border="1px solid rgba(255,255,255, 0.2)"
    >
      <Text variant="notoSan" fontSize="35px">
        Impetus
      </Text>
      <Text
        variant="notoSan"
        fontSize="68px"
        my="60px !important"
        color={color}
      >
        {name}
      </Text>
      <HStack
        w={{ base: "100%", lg: "70%" }}
        justifyContent="space-between"
        my="10px !important"
      >
        <Text variant="smSan" color="#ccc">
          APR%:
        </Text>
        <Text variant="notoSan" fontSize="20px">
          {apr}%
        </Text>
      </HStack>
      <HStack
        my="25px !important"
        w={{ base: "100%", lg: "70%" }}
        justifyContent="space-between"
      >
        <Text variant="smSan" color="#ccc">
          DURATION:
        </Text>
        <Text variant="notoSan" fontSize="35px">
          {duration} DAYS
        </Text>
      </HStack>
      <HStack
        my="15px !important"
        w={{ base: "100%", lg: "70%" }}
        justifyContent="space-between"
      >
        <Text variant="smSan" color="#ccc">
          TYPE:
        </Text>
        <Text variant="notoSan" fontSize="20px">
          LOCK
        </Text>
      </HStack>
      <HStack
        my="15px !important"
        w={{ base: "100%", lg: "70%" }}
        justifyContent="space-between"
      >
        <Text variant="smSan" color="#ccc">
          MAX CAP:
        </Text>
        <Text variant="notoSan" fontSize="20px">
          20,000,000 IPT
        </Text>
      </HStack>
      <Button
        disabled={!walletInfo.address}
        fontSize="30px"
        variant="primary"
        w="full"
        py="40px"
        mt="30px !important"
        fontWeight="bold"
        onClick={onStack}
      >
        STAKE NOW
      </Button>
    </VStack>
  );
}
