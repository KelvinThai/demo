import { Flex, HStack, Image, Link, Spacer, Text } from "@chakra-ui/react";
import { ConnectWallet, WalletInformation } from "../components";
import { menus } from "../configs/constants";
import { useAppSelector } from "../reduxs/hooks";
import MobileMenu from './MobileMenu'

export default function Header() {
  const {walletInfo} = useAppSelector((state) => state.account);
  return (
    <Flex w="full" h="120px" alignItems="center" justifyContent="space-between" px="20px">
      <Image src="/logo.svg" alt="logo" w="30px" h="30px" />
      <Text variant="with-title" fontSize="50px" fontWeight="bold" ml="10px">I</Text>
      <Text variant="with-title" fontSize="40px" >mpetus</Text>
      <Spacer />
      <HStack display={{base: 'none', lg: 'flex'}}>
      {menus.map((menu) =>  <Link 
                    mx="20px !important"
                    href={`${menu.url}`} 
                    py="20px"
                    textDecoration="none" key={menu.name}>
                    <Text variant="with-title">{menu.name}</Text>
                </Link>)}
      </HStack>
      {!walletInfo.address && <ConnectWallet display={{base: 'none', lg: 'block'}} />}
      {walletInfo.address &&  <WalletInformation display={{base: 'none', lg: 'flex'}} />}
      <MobileMenu />
    </Flex>
  )
}