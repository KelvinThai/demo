import { Divider, Flex, SimpleGrid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { packages } from "../../configs/constants";
import { buyICOAction, generateContract } from "../../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../../reduxs/hooks";
import { IPackage, TOKEN } from "../../types";
import { getToast } from "../../utils";
import InvestCard from "./components/InvestCard";
import {SuccessModal} from '../../components';

export default function InvestView() {
  const dispatch = useAppDispatch();
  const {walletInfo, buyIco, web3Provider} = useAppSelector((state) => state.account);
  const toast = useToast();
  const {isOpen, onClose, onOpen} = useDisclosure();
  

  const handleBuyIcon = async (pk: IPackage) => {
    try {
      await dispatch(buyICOAction(pk)).unwrap();
      onOpen();
      if (web3Provider) 
        await dispatch(generateContract(web3Provider));
    } catch(er) {
      toast(getToast(buyIco.errMsg));
    }
  }

  return (
    <>
    <Flex flex={1} direction="column">
      <Text variant="notoSan" fontSize="40px" mt="50px" mb="30px">PACKAGES</Text>
      <Divider />
      <SimpleGrid columns={{base: 1, lg: 3} }spacing={20} mt="30px">
        {packages.map((pk) => <InvestCard 
        rate={pk.token === TOKEN.BNB ? walletInfo.bnbRate : walletInfo.usdtRate} 
        key={pk.key} 
        pak={pk} 
        isBuying={buyIco.isProcessing && buyIco.key === pk.key}
        onClick={() => handleBuyIcon(pk)}
        />)}
      </SimpleGrid>
    </Flex>
    <SuccessModal 
      hash={buyIco.has}
      isOpen={isOpen}
      onClose={onClose}
      title="BUY ICO"
    />
    </>
  );
}
