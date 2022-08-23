import React, { useCallback, useEffect, useState } from "react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import {
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Box,
  Image,
  useToast,
  useBoolean,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { fonts, IPT_PRICE } from "../../configs/constants";
import {
  getBscScanUrl,
  getToast,
  numberFormat,
  showTransactionHash,
} from "../../utils";
import LendingContract, {
  ILendInfo,
  LENDING_DAYS,
  LENDING_PACKAGE,
} from "../../contracts/LendingContract";
import { useAppSelector } from "../../reduxs/hooks";
import FakeUsdtContract from "../../contracts/FakeUsdtContract";
import MyLockedLending from "./MyLockedStaking";
import CountUp from "react-countup";

export default function LendingView() {
  const toast = useToast();
  const { web3Provider, walletInfo } = useAppSelector((state) => state.account);
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const [pk, setPackage] = React.useState<number>(0);
  const [days, setDays] = React.useState<number>(0);
  const [profit, setProfit] = React.useState<number>(0);
  const [isLending, setIsLending] = useBoolean();
  const [lendingSuccess, setLendingSuccess] = useBoolean();
  const [txHash, setTxHash] = useState<string>();
  const [info, setInfo] = useState<ILendInfo>();

  const handleSelectPackage = (nu: number) => {
    setPackage(nu);
    nextStep();
  };

  const handleSelectDays = (nu: number) => {
    setDays(nu);
    nextStep();
  };

  const handleConfirm = async () => {
    if (!web3Provider) return;
    setIsLending.on();
    setLendingSuccess.off();
    setTxHash(undefined);
    try {
      const lendingContract = new LendingContract(web3Provider);
      const usdtFakeContract = new FakeUsdtContract(web3Provider);
      await usdtFakeContract.approve(lendingContract._contractAddress, pk);
      const hash = await lendingContract.lendToken(pk, days);
      setTxHash(hash);
      setLendingSuccess.on();
      nextStep();
      handleGetLenderInfo();
    } catch (er: any) {
      toast(getToast(`${er}`));
    }
    setIsLending.off();
  };

  const handleGetAmountOuts = useCallback(async () => {
    try {
      if (!pk || !days) return;
      const lendingContract = new LendingContract(web3Provider);
      const amount = await lendingContract.getTokenAmountOuts(pk, days);
      setProfit(amount);
    } catch (ex: any) {
      toast(getToast(ex));
    }
  }, [pk, days]);

  const handleNavigate = React.useCallback(() => {
    setLendingSuccess.off();
    reset();
    if (window) {
      window.open(`${getBscScanUrl()}${txHash}`, "_blank");
    }
  }, [txHash]);

  useEffect(() => {
    handleGetAmountOuts();
  }, [handleGetAmountOuts]);

  const handleGetLenderInfo = useCallback(async () => {
    const inf = await new LendingContract().getLendInfo();
    setInfo(inf);
  }, []);

   useEffect(() => {
    handleGetLenderInfo();
   }, [handleGetLenderInfo])

  return (
    <Flex justifyContent="center" w="full" direction="column">
      <Text variant="notoSan" lineHeight="67px">
        Lending Your IPT
      </Text>
      <Text
        mt="20px !important"
        color="#ccc"
        w={{ base: "100%", lg: "50%" }}
        fontFamily={fonts.DMSANS_MEDIUM}
        fontWeight="bold"
      >
        Profitable lending
      </Text>
      <Text
        mt="10px !important"
        color="#ccc"
        w={{ base: "100%", lg: "50%" }}
        fontFamily={fonts.DMSANS_MEDIUM}
      >
        Earning rewards and shared revenue through lending & yield farming pool
        with lucrative APR & APY along with lower or no gas fee.
      </Text>

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        borderRadius="8px"
        py="50px"
        my="50px"
      >
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Number of Lender
          </Text>
          <Text variant="notoSan" mt="20px !important">
            <CountUp duration={0.3} end={info?.totalLender || 0} />
          </Text>
        </VStack>
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Total Lend Amount
          </Text>
          <Text variant="notoSan" mt="20px !important">
            <CountUp duration={2} end={info?.totalAmount || 0} separator="," />
          </Text>
        </VStack>
      </SimpleGrid>

      <Tabs align="start" isFitted mt="40px">
        <TabList>
          <Tab>
            <Text
              variant="notoSan"
              fontSize="16px"
              color="rgba(255,255,255, 0.5)"
            >
              LENDING
            </Text>
          </Tab>
          <Tab>
            <Text
              variant="notoSan"
              fontSize="16px"
              color="rgba(255,255,255, 0.5)"
            >
              MY LOCKED LENDING
            </Text>
          </Tab>
        </TabList>

        <TabPanels mt="20px">
          <TabPanel>
            <Flex flexDir="column" w="100%" paddingTop="10px">
              <HStack justifyContent="space-between" pb="20px">
                <Text variant="notoSan" fontSize="0px">
                  .
                </Text>
                <HStack>
                  <Button
                    isDisabled={activeStep === 0 || lendingSuccess || isLending}
                    bgColor="#1F75FF"
                    size="sm"
                    onClick={prevStep}
                  >
                    <Image
                      src="/arrow-active.svg"
                      w="20px !important"
                      transform="rotate(180deg)"
                    />
                  </Button>
                  <Button
                    isDisabled={
                      activeStep === 2 ||
                      !pk ||
                      !days ||
                      lendingSuccess ||
                      isLending
                    }
                    bgColor="#1F75FF"
                    onClick={nextStep}
                    size="sm"
                  >
                    <Image src="/arrow-active.svg" w="20px !important" />
                  </Button>
                </HStack>
              </HStack>
              <Steps activeStep={activeStep} py="30px">
                <Step label="Select Package" key={1}>
                  <VStack align="center" borderRadius="16px">
                    <SimpleGrid columns={{ base: 1, lg: 3 }} w="full">
                      {LENDING_PACKAGE.map((a) => (
                        <HStack
                          key={a}
                          onClick={() => handleSelectPackage(a)}
                          my="20px"
                          bg="rgba(255,255,255, 0.1)"
                          py="20px"
                          px="20px"
                          mx="20px"
                          borderRadius="5px"
                          border="1px solid rgba(255,255,255, 0.1)"
                          boxShadow="1px 2px rgba(255,255,255, 0.2)"
                          cursor="pointer"
                          _hover={{ bg: "rgba(255,255,255, 0.05)" }}
                        >
                          <Box
                            w="30px"
                            h="30px"
                            borderRadius="full"
                            border="1px solid white"
                            alignItems="center"
                            justifyContent="center"
                            display="flex"
                          >
                            {pk === a && (
                              <Box
                                w="15px"
                                h="15px"
                                borderRadius="full"
                                border="1px solid white"
                                bg="white"
                              />
                            )}
                          </Box>
                          <Text variant="notoSan" fontSize="20px">
                            {numberFormat(a)} USDT
                          </Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </Step>
                <Step label="Select Option" key={2}>
                  <SimpleGrid columns={{ base: 1, lg: 4 }} w="full">
                    {LENDING_DAYS.map((a) => (
                      <HStack
                        key={a}
                        onClick={() => handleSelectDays(a)}
                        my="20px"
                        bg="rgba(255,255,255, 0.1)"
                        py="20px"
                        px="20px"
                        mx="20px"
                        borderRadius="5px"
                        border="1px solid rgba(255,255,255, 0.1)"
                        boxShadow="1px 2px rgba(255,255,255, 0.2)"
                        cursor="pointer"
                        _hover={{ bg: "rgba(255,255,255, 0.05)" }}
                      >
                        <Box
                          w="30px"
                          h="30px"
                          borderRadius="full"
                          border="1px solid white"
                          alignItems="center"
                          justifyContent="center"
                          display="flex"
                        >
                          {days === a && (
                            <Box
                              w="15px"
                              h="15px"
                              borderRadius="full"
                              border="1px solid white"
                              bg="white"
                            />
                          )}
                        </Box>
                        <Text variant="notoSan" fontSize="20px">
                          {numberFormat(a)} Days
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Step>
                <Step label="Confirm" key={3}>
                  <HStack
                    align="center"
                    w="full"
                    display="flex"
                    justifyContent="center"
                  >
                    <VStack
                      w={{ base: "100%", lg: "50%" }}
                      align="center"
                      padding="40px"
                      bg="rgba(255,255,255, 0.1)"
                      borderRadius="8px"
                    >
                      <HStack w="full" justifyContent="space-between">
                        <Text variant="dmSan" color="rgba(255,255,255, 0.6)">
                          Package:
                        </Text>
                        <Text variant="dmSan" fontSize="20px">
                          {numberFormat(pk)} USDT
                        </Text>
                      </HStack>
                      <HStack
                        w="full"
                        justifyContent="space-between"
                        my="20px !important"
                        borderTop="1px solid rgba(255,255,255, 0.08)"
                        borderBottom="1px solid rgba(255,255,255, 0.08)"
                        py="20px"
                      >
                        <Text variant="dmSan" color="rgba(255,255,255, 0.6)">
                          Days:{" "}
                        </Text>
                        <Text variant="dmSan" fontSize="20px">
                          {days} Days
                        </Text>
                      </HStack>
                      <HStack w="full" justifyContent="space-between">
                        <Text variant="dmSan" color="rgba(255,255,255, 0.6)">
                          Profit:{" "}
                        </Text>
                        <Text variant="dmSan" fontSize="20px">
                          {numberFormat(profit)} IPT
                        </Text>
                      </HStack>
                      <Button
                        variant="primary"
                        w="full"
                        mt="40px !important"
                        py="30px !important"
                        fontSize="20px"
                        disabled={
                          !pk || !days || isLending || !walletInfo.address
                        }
                        onClick={handleConfirm}
                      >
                        {isLending ? (
                          <Spinner />
                        ) : !walletInfo.address ? (
                          "Connect your wallet"
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    </VStack>
                  </HStack>
                </Step>
              </Steps>
              {lendingSuccess && (
                <Flex
                  px={4}
                  py={4}
                  width="100%"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Heading fontSize="xl" textAlign="center">
                    Lending completed!
                  </Heading>
                  <Text fontStyle="italic" fontSize="12px" mt="10px">
                    (Your Transaction Successful!)
                  </Text>
                  <Button
                    w="40%"
                    variant="primary"
                    mt="20px"
                    onClick={handleNavigate}
                  >
                    {showTransactionHash(txHash || "")}
                  </Button>
                </Flex>
              )}
            </Flex>
          </TabPanel>
          <TabPanel>
            <MyLockedLending tranHash={txHash} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
