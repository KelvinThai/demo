import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { fonts } from "../../../configs/constants";

export default function MarketItem() {
  return (
    <Box w="400px" minH="600px" bg="#0E1E45" borderRadius="16px" padding="16px">
      <Box
        w="100%"
        h="338px"
        bgColor="#ccc"
        borderRadius="16px"
        overflow="hidden"
      ></Box>
      <Text variant="notoSan" fontSize={{ base: "20px", lg: "32px" }} my="26px">
        Inner State : Joy
      </Text>
      <SimpleGrid columns={2}>
        <VStack alignItems="flex-start">
          <Text color="#ccc" fontWeight="normal">Last Price</Text>
          <Text variant="notoSan" fontSize="24px">0.4435 ETH</Text>
          <Text color="#fff" fontFamily={fonts.NOTOSANS} fontSize="14px">$1.231</Text>
          <VStack alignItems="flex-start"  mt="25px !important">
            <Text color="#ccc" fontWeight="normal">Artist</Text>
            <HStack>
              <Box w="32px" h="32px" bg="#ccc" borderRadius="full"></Box>
              <Text color="#fff" fontFamily={fonts.NOTOSANS} fontSize="14px">CameronWill</Text>
            </HStack>
          </VStack>
        </VStack>
        <VStack alignItems="flex-start" ml="30px">
          <Text color="#ccc" fontWeight="normal">Last Sale Price</Text>
          <Text variant="notoSan" fontSize="24px">1 ETH</Text>
          <Text color="#fff" fontFamily={fonts.NOTOSANS} fontSize="14px">$2228</Text>
          <VStack alignItems="flex-start"  mt="25px !important">
            <Text color="#ccc" fontWeight="normal">Owner</Text>
            <HStack>
              <Box w="32px" h="32px" bg="#ccc" borderRadius="full"></Box>
              <Text color="#fff" fontFamily={fonts.NOTOSANS} fontSize="14px">Williamson</Text>
            </HStack>
          </VStack>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
