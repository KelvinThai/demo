import {
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { SuccessModal } from "../../components";
import { fonts, IPT_PRICE } from "../../configs/constants";
import { getStakeInfoAction } from "../../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../../reduxs/hooks";
import { numberFormat } from "../../utils";
import StakeItem from "./components/StakeItem";
import StakingModal from "./components/StakingModal";
import CountUp from "react-countup";
import MyLockedStaking from "./components/MyLockedStaking";

export default function StakingView() {
  const dispatch = useAppDispatch();
  const { stakeInfo } = useAppSelector((state) => state.account);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [stakeType, setStakeType] = useState<"GOLD" | "SILVER">("SILVER");
  const [txHash, setTxHash] = useState<string>();
  const {
    isOpen: isSuccessModal,
    onClose: onCloseSuccessModal,
    onOpen: onOpenSuccessModal,
  } = useDisclosure();

  const getStakeInfo = useCallback(() => {
    dispatch(getStakeInfoAction());
  }, [dispatch]);

  React.useEffect(() => {
    getStakeInfo();
  }, [getStakeInfo]);

  const handleStakeSuccess = useCallback(
    (hash: string) => {
      setTxHash(hash);
      getStakeInfo();
      onOpenSuccessModal();
      onClose();
    },
    [getStakeInfo, onClose, onOpenSuccessModal]
  );

  return (
    <Flex flexDirection="column">
      <Text variant="notoSan" lineHeight="67px">
        STAKE Your IPT
      </Text>
      <Text
        mt="20px !important"
        color="#ccc"
        w={{ base: "100%", lg: "50%" }}
        fontFamily={fonts.DMSANS_MEDIUM}
        fontWeight="bold"
      >
        Profitable Staking & Yield Farming Ecosystem
      </Text>
      <Text
        mt="10px !important"
        color="#ccc"
        w={{ base: "100%", lg: "50%" }}
        fontFamily={fonts.DMSANS_MEDIUM}
      >
        Earning rewards and shared revenue through staking & yield farming pool
        with lucrative APR & APY along with lower or no gas fee.
      </Text>
      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        // bgColor="rgba(255,255,255, 0.1)"
        borderRadius="8px"
        py="50px"
        my="50px"
        // border="1px solid rgba(255,255,255, 0.2)"
      >
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Number of stakers
          </Text>
          <Text variant="notoSan" mt="20px !important">
            <CountUp duration={0.3} end={stakeInfo?.totalStaker || 0} />
          </Text>
        </VStack>
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Total IPT staked
          </Text>
          <Text variant="notoSan" mt="20px !important">
            <CountUp
              duration={2}
              end={stakeInfo?.totalStakedAmount || 0}
              separator=","
            />
          </Text>
        </VStack>
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Total Value Locked
          </Text>
          <Text variant="notoSan" mt="20px !important">
            $
            <CountUp
              duration={2}
              end={(stakeInfo?.totalStakedAmount || 0) * IPT_PRICE}
              separator=","
            />
          </Text>
        </VStack>
        <VStack my="20px">
          <Text variant="dmSan" color="#ccc">
            Price IPT
          </Text>
          <Text variant="notoSan" mt="18px !important">
            ${IPT_PRICE}
          </Text>
        </VStack>
      </SimpleGrid>

      <Tabs align="start" isFitted>
        <TabList>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">STAKING</Text>
          </Tab>
          <Tab>
             <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">MY LOCKED STAKING</Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="100px">
              <StakeItem
                name="SILVER"
                apr={90}
                duration={14}
                onStack={() => {
                  setStakeType("SILVER");
                  onOpen();
                }}
              />
              <StakeItem
                name="GOLD"
                apr={120}
                duration={30}
                onStack={() => {
                  setStakeType("GOLD");
                  onOpen();
                }}
              />
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <MyLockedStaking tranHash={txHash} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <StakingModal
        isOpen={isOpen}
        stakeType={stakeType}
        onClose={onClose}
        onSuccess={(hash) => handleStakeSuccess(hash)}
      />

      <SuccessModal
        title="STAKE SUCCESS"
        onClose={onCloseSuccessModal}
        isOpen={isSuccessModal}
        hash={txHash}
      />
    </Flex>
  );
}
