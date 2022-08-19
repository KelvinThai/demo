import { Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import MainLayout from '../layouts'
import MarketView from '../views/Markets'
import ConvertTicket from '../views/Vaults/ConvertTicket'

const Home: NextPage = () => {
  return <MarketView />
}

export default Home
