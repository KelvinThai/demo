import { Flex, Box, Text, Input, Button } from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  return (
    <Flex w="100%" pt="160px">
      <Box
        w="90%"
        margin="0px auto"
        h="300px"
        bg="bg.secondary"
        borderRadius="8px"
        alignItems="center"
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Text
          w="60%"
          textAlign="center"
          lineHeight={{base: '32px', lg: "64px"}}
          fontSize={{base: '24px', lg:"48px"}}
          variant="notoSan"
        >
          Stay in the loop on Impetus and NFTs
        </Text>
        <Flex w={{base: '94%', lg:"50%"}} mt="32px">
          <Input w="90%" bg="#0E1E45" padding="16px" placeholder="Your Email" />
          <Button variant="primary" mx="16px">Subscribe</Button>
        </Flex>
      </Box>
    </Flex>
  );
}
