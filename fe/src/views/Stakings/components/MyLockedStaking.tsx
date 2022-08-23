import {
  Button,
  Flex,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { SuccessModal } from "../../../components";
import StakeContract from "../../../contracts/StakeContract";
import { useAppSelector } from "../../../reduxs/hooks";
import { IStakerInfo } from "../../../types";
import { formatDateYYYYMMDDHHMMSS, getToast, numberFormat } from "../../../utils";

export interface IProps {tranHash?: string}

const MyLockedStaking = ({tranHash}: IProps) => {
  const { walletInfo, web3Provider } = useAppSelector((state) => state.account);
  const [lockedStake, setLockedStake] = React.useState<IStakerInfo[]>([]);
  const [isSuccess, setIsSuccess] = useBoolean();
  const [txHash, setTxHash] = React.useState<string>();
  const [isUnStaking, setIsUnStaking] = React.useState<boolean>(false);
  const [stakedIndex, setStakedIndex] = React.useState<number>(-1);

  const toast = useToast();

  const handleGetStakerInfo = React.useCallback(async() => {
    if (web3Provider && walletInfo.address) {
      const stakeContract = new StakeContract(web3Provider);
      const rs = await stakeContract.getStakerInfo(walletInfo.address);
      setLockedStake(rs);
    } else {
      setLockedStake([]);
    }
  }, [web3Provider, walletInfo.address, tranHash]);

  React.useEffect(() => {
    handleGetStakerInfo();
  }, [handleGetStakerInfo]);

  const handleUnStake = React.useCallback(async(index) => {
    if (!web3Provider) return;
    try {
      setStakedIndex(index);
      setIsUnStaking(true);
      const stakeContract = new StakeContract(web3Provider);
      const tx = await stakeContract.onWithdraw(index);
      setTxHash(tx);
      setIsSuccess.on();
    } catch(er: any) {
      toast(getToast(er?.message || 'something error!'));
    }
    setIsUnStaking(false);
    setStakedIndex(-1);
  }, [web3Provider,]);

  return (
    <Flex flex={1}>
      <TableContainer w="full">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>PACKAGE</Th>
              <Th>STAKE AMOUNT</Th>
              <Th>WITHDRAW DATE</Th>
              <Th>COUNT DOWN</Th>
              <Th>PROFIT</Th>
              <Th>TOTAL AMOUNT</Th>
              <Th>ACTION</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lockedStake.map((info, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Text>{info.termOption === "14" ? "SILVER" : "GOLD"}</Text>
                  </Td>
                  <Td>
                    <Text>{numberFormat(info.amount)} IPT</Text>
                  </Td>
                  <Td>
                    <Text>
                      {formatDateYYYYMMDDHHMMSS(info.releaseDate)} IPT
                    </Text>
                  </Td>
                  <Td>{info.days}</Td>
                  <Td>{numberFormat(info.rewardDebt)} IPT</Td>
                  <Td>{numberFormat(info.rewardDebt + info.amount)} IPT</Td>
                  <Td>
                    <Button
                    onClick={() => handleUnStake(index)}
                      variant="primary"
                      disabled={info.isRelease || info.isLock}
                      padding="3px 15px"
                      fontSize="12px"
                    >
                     {isUnStaking && index === stakedIndex ? <Spinner /> : 'WITHDRAW'}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <SuccessModal 
        title="WITHDRAW SUCCESS"
        hash={txHash}
        isOpen={isSuccess}
        onClose={() => setIsSuccess.off()}
      />
    </Flex>
  );
};

export default MyLockedStaking;
