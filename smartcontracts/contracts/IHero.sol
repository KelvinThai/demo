//SPDX-License-Identifier: UNLICENSED
pragma solidity <=8.10;

interface IHero {
    function mint(address to,uint256 hero_type) external returns (uint256);
}