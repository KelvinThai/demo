import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import Footer from "./Footer";
import Header from "./Header";

export interface IProps {
  children: ReactNode;
}
export default function MainLayout({ children }: IProps) {
  const {height} = useWindowSize();
  return (
    <Flex 
      w="100%"
      maxW="1440px" 
      margin="0px auto" 
      bg="#06132D"
      minH={height}
      flexDirection="column" 
      alignItems="flex-start" 
      justifyContent="flex-start"
      >
        <Header />
        <Flex flexDirection="column" w="100%" px="20px" py="20px" minH={height * 0.6} mt="56px">
          {children}
        </Flex>
        <Footer />
    </Flex>
  )
}