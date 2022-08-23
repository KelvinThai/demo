import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Flex,
  ModalCloseButton,
  HStack,
  Input,
  useToast,
  useBoolean,
  Spinner,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { NUMBER_PATTERN } from "../../../configs/constants";
import IPTContract from "../../../contracts/IPTContract";
import StakeContract from "../../../contracts/StakeContract";
import { useAppSelector } from "../../../reduxs/hooks";
import { endDate, formatDate, getToast, numberFormat } from "../../../utils";

const MIN_AMOUNT =  2000;

interface IProps extends Omit<ModalProps, "children"> {
  title?: string;
  stakeType: "GOLD" | "SILVER";
  onSuccess?: (hash: string) => void;
}

export default function StakingModal({
  title = "Impetus ",
  stakeType,
  onSuccess,
  ...props
}: IProps) {
  const { web3Provider, walletInfo } = useAppSelector((state) => state.account);
  const availableAmount = walletInfo.iptBalance;
  const [amount, setAmount] = useState<number>(0);  
  const [isProcessing, processAction] = useBoolean();
  
  const onPercent = (percent: number) => setAmount(percent * availableAmount);
  const beginDate = useMemo(() => { return formatDate(new Date());}, []);

  const getEndDate = useMemo(() => {return endDate(new Date(), stakeType === "GOLD" ? 30 : 14);
  }, [stakeType]);

  const totalInterest = useMemo(() => {
    const a = amount * (stakeType === "GOLD" ? 1.2 : 0.9);
    const amountDay = a / 365;
    const total = amount + amountDay * (stakeType === "GOLD" ? 30 : 14);
    return numberFormat(total);
  }, [amount, stakeType]);

  const toast = useToast();

  const onConfirm = async () => {
    processAction.on();
    try {
      if (!web3Provider) return;
      const stakeContract = new StakeContract(web3Provider);
      const iptContract = new IPTContract(web3Provider);
      await iptContract.approve(stakeContract._contractAddress, amount);
      const hash =
        stakeType === "GOLD"
          ? await stakeContract.oneMonthStake(amount)
          : await stakeContract.twoWeekStake(amount);
        onSuccess && onSuccess(hash);
        setAmount(0);
    } catch (er) {
      toast(getToast(`${er}`));
    }
    processAction.off();
  };

  return (
    <Modal closeOnOverlayClick={false} size="4xl" {...props}>
      <ModalOverlay
        blur="2xl"
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent py="30px">
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            w="full"
            direction="column"
          >
            <Text
              variant="notoSan"
              fontSize="30px"
              textTransform="uppercase"
              my="20px"
            >
              {title} {stakeType}
            </Text>
            <Flex flexDirection={{base: 'column', lg: 'row'}} w="full" my="20px">
              <Flex
                flex={1}
                direction="column"
                px="20px"
                bg="rgba(255,255,255, 0.03)"
                borderRadius="16px"
                border="1px solid rgba(255,255,255, 0.1)"
                mt="10px"
              >
                <HStack
                  w="full"
                  justifyContent="space-between"
                  py="10px"
                  borderBottom="1px inset rgba(255,255,255, 0.05)"
                >
                  <Text color="#ccc" fontSize="12px">
                    Duration:
                  </Text>
                  <Text>{stakeType === "SILVER" ? 14 : "30"}</Text>
                </HStack>
                <HStack
                  w="full"
                  justifyContent="space-between"
                  py="10px"
                  borderBottom="1px solid rgba(255,255,255, 0.05)"
                >
                  <Text color="#ccc" fontSize="12px">
                    Stake date:
                  </Text>
                  <Text>{beginDate}</Text>
                </HStack>
                <HStack
                  w="full"
                  justifyContent="space-between"
                  py="10px"
                  borderBottom="1px inset rgba(255,255,255, 0.05)"
                >
                  <Text color="#ccc" fontSize="12px">
                    End date:
                  </Text>
                  <Text>{getEndDate}</Text>
                </HStack>
                <HStack
                  w="full"
                  justifyContent="space-between"
                  py="10px"
                  borderBottom="1px inset rgba(255,255,255, 0.05)"
                >
                  <Text color="#ccc" fontSize="12px">
                    APY:
                  </Text>
                  <Text>{stakeType === "SILVER" ? 90 : 120} %</Text>
                </HStack>
                <HStack w="full" justifyContent="space-between" py="10px">
                  <Text color="#ccc" fontSize="12px">
                    Total interest:
                  </Text>
                  <Text variant="dmSan">{totalInterest} IPT</Text>
                </HStack>
              </Flex>
              <Flex flex={1.5}  mt="10px" px="20px" direction="column">
                <Flex justifyContent="space-between">
                  <Text color="#ccc" fontSize="12px">
                    Stake amount
                  </Text>
                  <Text color="#ccc" fontSize="12px">
                    Available amount: {numberFormat(availableAmount)} IPT
                  </Text>
                </Flex>
                <Flex position="relative">
                  <Input
                    placeholder="0"
                    my="10px"
                    py="30px !important"
                    fontSize="25px"
                    value={numberFormat(amount)}
                    type="text"
                    pattern={NUMBER_PATTERN}
                    onChange={(e) => {
                      const v = e.target.value.split(',').join('');
                      setAmount( v ? parseFloat(v) : 0);
                    }}
                  />
                  <Text
                    variant="notoSan"
                    fontSize="25px"
                    position="absolute"
                    color="rgba(255,255,255, 0.3)"
                    top="25px"
                    right="15px"
                  >
                    IPT
                  </Text>
                </Flex>
                <HStack justifyContent="space-around" my="15px">
                  <Button
                    variant="outline"
                    p="3px 5px !important"
                    fontSize="14px"
                    borderRadius="full"
                    onClick={() => onPercent(0)}
                  >
                    0%
                  </Button>
                  <Button
                    onClick={() => onPercent(0.25)}
                    variant="outline"
                    p="3px 5px !important"
                    fontSize="14px"
                    borderRadius="full"
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    p="3px 5px !important"
                    fontSize="14px"
                    borderRadius="full"
                    onClick={() => onPercent(0.5)}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    p="3px 5px !important"
                    fontSize="14px"
                    borderRadius="full"
                    onClick={() => onPercent(0.75)}
                  >
                    75%
                  </Button>
                  <Button
                    variant="outline"
                    p="3px 5px !important"
                    fontSize="14px"
                    borderRadius="full"
                    onClick={() => onPercent(1)}
                  >
                    100%
                  </Button>
                </HStack>
                <Button
                  w="full"
                  variant="primary"
                  mt="20px"
                  disabled={!walletInfo.address || amount <= 0 || isProcessing || amount < MIN_AMOUNT}                  
                  onClick={onConfirm}
                >
                 {isProcessing ? <Spinner /> : 'CONFIRM'} 
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
