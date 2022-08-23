import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { SuccessModal } from "../../components";
import LendingContract, { ILenderInfo } from "../../contracts/LendingContract";
import { useAppSelector } from "../../reduxs/hooks";
import { formatDateYYYYMMDDHHMMSS, getDays, getDaysFromCurrent, getToast, isAfter, numberFormat } from "../../utils";

export interface IProps {tranHash?: string}

const MyLockedLending = ({tranHash}: IProps) => {
  const { walletInfo, web3Provider } = useAppSelector((state) => state.account);
  const [lockedLending, setLockedLending] = React.useState<ILenderInfo[]>([]);
  const [isSuccess, setIsSuccess] = useBoolean();
  const [txHash, setTxHash] = React.useState<string>();
  const [isUnLending, setIsUnLending] = React.useState<boolean>(false);
  const [lendIndex, setLendIndex] = React.useState<number>(-1);

  const toast = useToast();

  const handleGetLenderInfo = React.useCallback(async() => {
    if (web3Provider && walletInfo.address) {
      const lendingContract = new LendingContract(web3Provider);
      const rs = await lendingContract.getLenderInfos(walletInfo.address);
      setLockedLending(rs);
    } else {
      setLockedLending([]);
    }
  }, [web3Provider, walletInfo.address, tranHash]);

  React.useEffect(() => {
    handleGetLenderInfo();
  }, [handleGetLenderInfo]);

  const handleUnLend = React.useCallback(async(index) => {
    if (!web3Provider) return;
    try {
      setLendIndex(index);
      setIsUnLending(true);
      const lendingContract = new LendingContract(web3Provider);
      const tx = await lendingContract.unLendToken(index);
      setTxHash(tx);
      setIsSuccess.on();
    } catch(er: any) {
      toast(getToast(er?.message || 'something error!'));
    }
    setIsUnLending(false);
    setLendIndex(-1);
  }, [web3Provider,]);

  return (
    <Flex flex={1}>
      <TableContainer w="full">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>PACKAGE</Th>
              <Th>OPTION</Th>
              <Th>RELEASE DATE</Th>
              <Th>COUNT DOWN</Th>              
              <Th>REWARD DEBT</Th>
              <Th>ACTION</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lockedLending.map((info, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Text>{numberFormat(info.package)} USDT</Text>
                  </Td>
                  <Td>
                    <Text>{numberFormat(info.termOption)} Days</Text>
                  </Td>
                  <Td>
                    <Text>
                      {formatDateYYYYMMDDHHMMSS(info.releaseDate)}
                    </Text>
                  </Td>
                  <Td>{getDays(info.releaseDate)}</Td>
                  <Td>{numberFormat(info.rewardDebt)} IPT</Td>
                  <Td>
                    <Button
                    onClick={() => handleUnLend(index)}
                      variant="primary"
                      disabled={info.isRelease || isAfter(info.releaseDate) || isUnLending}
                      padding="3px 15px"
                      fontSize="12px"
                    >
                     {isUnLending && index === lendIndex ? <Spinner /> : 'UnLend'}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <SuccessModal 
        title="UNLEND SUCCESS"
        hash={txHash}
        isOpen={isSuccess}
        onClose={() => setIsSuccess.off()}
      />
    </Flex>
  );
};

export default MyLockedLending;
