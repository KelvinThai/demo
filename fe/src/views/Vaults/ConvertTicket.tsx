import {
  VStack,
  Text,
  Image,
  Box,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { depositWithdrawAction } from "../../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../../reduxs/hooks";
import { IVaultModel, TOKEN } from "../../types";
import { convertNumberTextInput, getToast, numberFormat } from "../../utils";
import InputGroup from "./components/InputGroup";
import SuccessModal from "../../components/SuccessModal";
import { NUMBER_PATTERN } from "../../configs/constants";

const MIN_AMOUNT = 2000;

export default function ConvertTicket() {
  const dispatch = useAppDispatch();
  const { walletInfo, convert } = useAppSelector((state) => state.account);
  const [isSuccess, setSuccess] = React.useState<boolean>(false);

  const [model, setModel] = React.useState<IVaultModel>({
    from: { token: "IPT", value: 0 },
    to: { token: "POINT", value: 0 },
  });

  const toast = useToast();

  const revert = () => {
    const revertModel: IVaultModel = {
      from: { ...model.to },
      to: { ...model.from },
    };
    setModel(revertModel);
  };

  const onValueChange = (val: string) => {
    const v = convertNumberTextInput(val);    
    const newModel: IVaultModel = {from: {...model.from, value: v}, to: {...model.to, value: v}};
    setModel(newModel);
  }

  const validate = () => {
    let mess = '';
    if (!model.from.value) mess = 'Amount must be greater than 0';
    else if (model.from.token === TOKEN.IPT && model.from.value > walletInfo.iptBalance) mess = 'your balance is not enough';
    if (mess) {
      toast(getToast(mess));
      return false;
    }
    return true;
  }

  const handleConvert = async () => {
    try {
      if (!validate()) return;
      const rs = await dispatch(depositWithdrawAction(model)).unwrap();
      setSuccess(true);
      setModel({
        from: { token: "IPT", value: 0 },
        to: { token: "POINT", value: 0 },
      })
    } catch (er) {
      toast(getToast(convert.errorMsg));
      setSuccess(false)
    }
  };

  return (
    <>
      <VStack
        w={{base: 'full', lg:"35%"}}
        margin="0px auto"
        bg="rgba(255,255,255, 0.2)"
        py="50px"
        px="50px"
        borderRadius="20px"
        border="3px solid rgba(255,255,255, 0.2)"
      >
        <Text variant="notoSan" fontSize={{base: '24px', lg: "38px"}}>
          Convert Ticket
        </Text>
        <InputGroup
          type="text" 
          item={model.from} 
          value={numberFormat(model.from.value)} 
          pattern={NUMBER_PATTERN}
          onChange={(e) => onValueChange(e.target.value)}
         />
        <Box
          bg="rgba(255,255,255, 0.3)"
          borderRadius="full"
          p="15px"
          cursor="pointer"
        >
          <Image src="/arrow.png" alt="revert" w="25px" onClick={revert} />
        </Box>
        <InputGroup
          item={model.to}
          value={numberFormat(model.to.value)}
          type="text"
          isReadOnly
          isDisabled
        />
        <Button
          variant="primary"
          w="full"
          py="30px !important"
          onClick={handleConvert}
          disabled={convert.isLoading || !walletInfo.address || !model.from.value || model.from.value < MIN_AMOUNT}
        >
          {convert.isLoading ? <Spinner color="color.white" /> : "Convert"}
        </Button>
      </VStack>
      <SuccessModal isOpen={isSuccess} onClose={() => setSuccess(!isSuccess)} hash={convert.hash}  />
    </>
  );
}
