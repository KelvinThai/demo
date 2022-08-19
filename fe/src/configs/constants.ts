import { IPackage, TOKEN } from "../types";

export const  IPT_PRICE = 0.2;

export const fonts = {
  DMSANS_BOLD: 'DMSans-Bold',
  DMSANS_BOLD_ITALIC: 'DMSans-BoldItalic',
  DMSANS_ITALIC: 'DMSans-Italic',
  DMSANS_MEDIUM: 'DMSans-Medium',
  DMSANS_MEDIUM_ITALIC: 'DMSans-MediumItalic',
  DMSANS_REGULAR: 'DMSans-Regular',
  NOTOSANS : "NotoSans-Bold"

}

export const menus = [
  { name: "Home", url: "/" },
  { name: "Market", url: "/" },
  { name: "Invest", url: "/invest" },
  { name: "Deposit/Withdraw", url: "deposit-withdraw" },
  { name: "Staking", url: "/staking" },
];

export const packages: IPackage[] = [
  {
    key: 'bnb-01',
    name: 'BNB PACKAGE 01',
    amount: 1000,
    bg: 'bnb-bg.jpeg',
    icon: 'bnb.png',
    token: TOKEN.BNB,
  },
  {
    key: 'bnb-02',
    name: 'BNB PACKAGE 02',
    amount: 2000,
    bg: 'bnb-bg.jpeg',
    icon: 'bnb.png',
    token: TOKEN.BNB,
  },
  {
    key: 'bnb-03',
    name: 'BNB PACKAGE 03',
    amount: 3000,
    bg: 'bnb-bg.jpeg',
    icon: 'bnb.png',
    token: TOKEN.BNB,
  },
  {
    key: 'usdt-01',
    name: 'USDT PACKAGE 01',
    amount: 1000,
    bg: 'usdt-bg.png',
    icon: 'usdt.png',
    token: TOKEN.USDT,
  },
  {
    key: 'usdt-02',
    name: 'USDT PACKAGE 02',
    amount: 2000,
    bg: 'usdt-bg.png',
    icon: 'usdt.png',
    token: TOKEN.USDT,
  },
  {
    key: 'usdt-03',
    name: 'USDT PACKAGE 03',
    amount: 3000,
    bg: 'usdt-bg.png',
    icon: 'usdt.png',
    token: TOKEN.USDT,
  }
]