import { Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import MainLayout from '../layouts'
import InvestView from '../views/Invests'
//import MarketView from '../views/Markets'
import ConvertTicket from '../views/Vaults/ConvertTicket'

const Home: NextPage = () => {
  return <InvestView />
}

export default Home
