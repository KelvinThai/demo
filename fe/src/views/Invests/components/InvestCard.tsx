import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Img,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { memo } from "react";
import { useAppSelector } from "../../../reduxs/hooks";
import { IPackage } from "../../../types";
import { numberFormat } from "../../../utils";

interface IProps {
  pak: IPackage;
  rate: number;
  isBuying: boolean;
  onClick?: () => void;
}

const InvestCard = ({ pak, rate = 1, isBuying, onClick }: IProps) => {
  const { walletInfo } = useAppSelector((state) => state.account);

  return (
    <Box
      w="400px"
      bg="bg.secondary"
      borderRadius="16px"
      overflow="hidden"
      padding="10px"
      border="1px solid #0f275f"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Box
        bgImage={`/${pak.bg}`}
        w="full"
        h="210px"
        borderRadius="16px"
        bgSize="cover"
        bgPos="center"
      />
      <Box
        w="120px"
        h="120px"
        margin="0px auto"
        borderRadius="full"
        marginTop="-60px"
        position="relative"
      >
        <Image
          src={`/${pak.icon}`}
          alt="bnb"
          w="120px"
          h="120px"
          borderRadius="full"
          objectFit="cover"
          border="6px solid #0E1E45"
        />
        <Image
          src="/verified.svg"
          w="80px"
          alt="verified"
          position="absolute"
          bottom="-30px"
          right="-20px"
        />
      </Box>
      <Text my="20px" variant="notoSan" fontSize="24px">
        {pak.name }
      </Text>
      <Button
        disabled
        variant="primary"
        my="20px"
        bg="transparent"
        border="1px solid #fff"
      >
        {numberFormat(pak.amount)} IPT
      </Button>
      <HStack my="15px">
        <Text color="gray">Amount of coins to pay: </Text>
        <Text variant="notoSan" fontSize="16px">
          {numberFormat(pak.amount / rate)} {pak.token}
        </Text>
      </HStack>
      <Button w="full" variant="primary" disabled={!walletInfo.address || isBuying} onClick={onClick}>
        {isBuying ? <Spinner /> : 'Buy Now'}        
      </Button>
    </Box>
  );
};

export default memo(InvestCard);
