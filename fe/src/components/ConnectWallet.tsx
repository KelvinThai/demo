import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { connectToMetamask } from '../contracts/EthersConnect'
import { useAppSelector } from '../reduxs/hooks'

interface IProps extends ButtonProps {}

export default function ConnectWallet({...props}: IProps) {
  const handleConnect = async () => { await connectToMetamask();}
  return (
    <Button {...props} variant="primary" mx="40px" onClick={handleConnect}>
      ConnectWallet
    </Button>
  )
}

