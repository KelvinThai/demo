const { BigNumber } =require('@ethersproject/bignumber');
const { Contract } =require( '@ethersproject/contracts');
const { SignerWithAddress } =require ('@nomiclabs/hardhat-ethers/signers');
const { formatEther } =require ("@ethersproject/units")
const chai =require ("chai");
const { expect } =require ('chai');
const chaiAsPromised =require ('chai-as-promised');
const { ethers }=require('hardhat');
const { keccak256 } =require ('ethers/lib/utils');

chai.use(chaiAsPromised);

function parseEther(amount) {
    return ethers.utils.parseUnits(amount.toString(), 18);
}
function getbyte(strinput) {
    var bytes = [];
    for (var i = 0; i < strinput.length; ++i) {
        bytes.push(strinput.charCodeAt(i));
    }
    return bytes;
}
describe("Lending Contract", () => {

    let owner,
        alice,
        bob,
        carol;

    let lending;
    let token;
    let usdt;
    beforeEach(async () => {

        await ethers.provider.send("hardhat_reset", []);

        [owner, alice, bob, carol] = await ethers.getSigners();

        
        const Token = await ethers.getContractFactory("ImpetusToken", owner);
        token = await Token.deploy();

        const Usdt = await ethers.getContractFactory("USDT", owner);
        usdt = await Usdt.deploy();

        const Lending = await ethers.getContractFactory("ImpetusLending", owner);
        lending = await Lending.deploy(token.address,usdt.address);

        //lending.setToken();
    })

    it('Should lending', async () => {
        await usdt.transfer(alice.address, parseEther(1 * 10 ** 6));
        await usdt.connect(alice).approve(lending.address, usdt.balanceOf(alice.address));
        await lending.connect(alice).lend(200,30);
        expect(await usdt.balanceOf(lending.address)).equal(parseEther(200));
        expect(await lending.totalLender()).equal(1);
        expect(await lending.lendingPools(0)).equal(parseEther(200));
    })

    it('Should unlend', async () => {
        await usdt.transfer(alice.address, parseEther(1 * 10 ** 6));
        await usdt.connect(alice).approve(lending.address, usdt.balanceOf(alice.address));
        await lending.connect(alice).lend(25000,30);
        await token.transfer(lending.address,parseEther(1 * 10 ** 6));

        expect(await usdt.balanceOf(lending.address)).equal(parseEther(25000));
        expect(await lending.totalLender()).equal(1);
        expect(await lending.lendingPools(0)).equal(parseEther(25000));

        // unlend
        // Time travel to release date: 30 days
        ethers.provider.send("evm_increaseTime", [30*24*60*60]);
        ethers.provider.send("evm_mine",[]);  
        await lending.connect(alice).unLend(0);
        expect(await usdt.balanceOf(lending.address)).equal(parseEther(25000));
        expect(await lending.totalLender()).equal(0);
        expect(await lending.lendingPools(0)).equal(parseEther(0));
    })

    it('Get infor', async () => {
        await usdt.transfer(alice.address, parseEther(1 * 10 ** 6));
        await usdt.connect(alice).approve(lending.address, usdt.balanceOf(alice.address));
        
        await token.transfer(lending.address,parseEther(1 * 10 ** 6));
        const packages=[200,500,1000,3000,5000,10000,25000];
        const terms=[30,90,180,365];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                await lending.connect(alice).lend(packages[j],terms[i]);
            }
        }
        // expect(await usdt.balanceOf(lending.address)).equal(parseEther(200));
        // expect(await lending.totalLender()).equal(1);
        // expect().equal(parseEther(200));

        // unlend
        // Time travel to release date: 30 days
        // ethers.provider.send("evm_increaseTime", [30*24*60*60]);
        // ethers.provider.send("evm_mine",[]);  
        // await lending.connect(alice).unLend(0);
        // expect(await usdt.balanceOf(lending.address)).equal(parseEther(200));
        // expect(await lending.totalLender()).equal(0);
        // expect(await lending.lendingPools(0)).equal(parseEther(0));
        const total=await lending.totalLender();
        console.log('total lender:'+ total);
        
        for (let i = 0; i < 4; i++) {
            const lendingpool= await lending.lendingPools(i);
            console.log('lending pool:'+ lendingpool);
            for (let j = 0; j < 7; j++) {
                const pool = await lending.detailLendingPool(i,j);
                console.log('Details pool'+ i+'-'+j+': '+pool);
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                const pool = await lending.tokenAmountOuts(i,j);
                console.log('Details pool'+ i+'-'+j+': '+pool);
            }
        }
        
    })

});
