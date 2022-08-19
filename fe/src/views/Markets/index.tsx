import { Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import { fonts } from '../../configs/constants';
import Filter from './components/Filter';
import MarketItem from './components/MarketItem';

export interface IProps {

}

const MarketView = () => {
  return (
    <Flex flexDirection="column">
      <Text variant='notoSan' lineHeight="64px">Crypto Impetus Market</Text>
      <Text mt="26px !important" color="#ccc" w={{base: '100%', lg: '50%'}} fontFamily={fonts.DMSANS_MEDIUM}>
        Lorem ipsum is a placeholder text commonly used to 
        demonstrate the visual form of a document or a typeface without
         relying on meaningful content.
      </Text>
      <Filter />
      <SimpleGrid spacing="16px" columns={{base: 1, lg: 3}}>
        {new Array(30).fill(1).map((i, index) => <MarketItem key={index.toString()} />)}
      </SimpleGrid>

    </Flex>
  );
};

export default MarketView;
