import { ComponentStyleConfig, extendTheme, ThemeConfig } from "@chakra-ui/react"
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import type {GlobalStyleProps } from "@chakra-ui/theme-tools"
import { fonts } from "../configs/constants"

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  bg: {
    primary: "#0047B8",
    secondary: "#0E1E45",
    tertiary: "#151D14",
  },
  color: {  
    white: "#ffffff",
    primary: "#0047B8",
    secondary: '#B2B2B2',  
  },
}

const Text: ComponentStyleConfig = {
  variants: {
    "with-title": {
      fontFamily: fonts.DMSANS_MEDIUM,
      fontSize: "16px",
      lineHeight: "28px",
      color: 'color.white',      
    },
    notoSan: {
      fontFamily: fonts.NOTOSANS,
      fontSize: "48px",
      lineHeight: "25px",
      color: "color.white"      
    },
    dmSan: {
      fontFamily: fonts.DMSANS_MEDIUM,
      fontSize: "16px",
      fontWeight: '700',
      lineHeight: "32px",
      color: 'color.white'
    }
  }
}   

const Button: ComponentStyleConfig = {
  variants: {
    'primary': {
      bg: 'bg.primary',
      borderRadius: "8px",
      color: "color.white",
      fontFamily: fonts.DMSANS_BOLD,
      fontWeight: 'bold',      
      padding: "12px 36px"
    },  
    'outline': {      
      borderRadius: "8px",
      color: "color.white",
      fontFamily: fonts.DMSANS_BOLD,
      fontWeight: 'bold',      
      padding: "12px 36px",
      border: "1px solid #fff"
    },   
    solid: (props: GlobalStyleProps) => ({
      bg: props.colorMode === 'dark' ? 'red.300' : 'red.500'
    })
  }
}

const Input: ComponentStyleConfig = {
  variants: {
    'primary': {
      bgColor: '#0E1E45',
      color: 'color.white',
      padding: "16px 32px",
      fontFamily: fonts.DMSANS_MEDIUM,
      fontSize: "18px",      
    },  
  }
}

const components = {
  Button,
  Text,  
  Input, 
  Steps,
}

const theme = extendTheme({
  config,
  colors,
  components, 
})

export default theme;