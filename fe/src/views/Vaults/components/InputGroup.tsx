import { VStack, Text, Input, HStack, Image, InputProps } from '@chakra-ui/react';
import React, { memo } from 'react';
import { fonts } from '../../../configs/constants';
import { Vault } from '../../../types';

export interface IProps extends InputProps {
  item: Vault;
}

const InputGroup = ({item, ...props}: IProps) => {
  return (
    <VStack w="full" justifyContent="flex-start" alignItems="flex-start" my="20px !important" >
      <HStack my="10px">
        <Image src={`/${item.token}.svg`} alt="logo" 
        borderRadius="full" 
        border="2px solid rgba(255,255,255, 0.3)"
        w="25px"
       />
        <Text color="rgba(255,255,255, 0.5)" fontWeight="bold" fontSize="20px">{item.token}</Text>
      </HStack>
      <Input
        variant="primary"
        bg="#0E1E45"
        placeholder="0"
        padding="26px !important"     
        fontSize="25px"
        fontWeight="bold"
        fontFamily={fonts.DMSANS_BOLD}
        border="1px solid rgba(255,255,255, 0.2)"
        {...props}
      />
    </VStack>
  );
};

export default memo(InputGroup);
