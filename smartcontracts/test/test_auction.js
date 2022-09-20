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
describe("Floppy Contract", () => {

    let owner,
        alice,
        bob,
        carol;

    let auction;
    let token;
    let hero;


    beforeEach(async () => {

        await ethers.provider.send("hardhat_reset", []);

        [owner, alice, bob, carol] = await ethers.getSigners();

        
        const Token = await ethers.getContractFactory("ImpetusToken", owner);
        token = await Token.deploy();

        const Hero = await ethers.getContractFactory("Hero", owner);
        hero = await Hero.deploy();

        const Auction = await ethers.getContractFactory("ImpetusAuction", owner);
        auction = await Auction.deploy(token.address,hero.address);

    })

    it('Should create auction', async () => {
        await token.transfer(alice.address, parseEther(1 * 10 ** 6));
        await token.transfer(bob.address, parseEther(1 * 10 ** 6));

        await token.connect(alice).approve(auction.address, token.balanceOf(alice.address));
        await hero.mint(alice.address, 2);
        await hero.mint(alice.address, 2);

        await hero.connect(alice).approve(auction.address,1);
        await hero.connect(alice).approve(auction.address,2);

        let n=new Date();

        let starttime=Math.round((n.getTime()+10000)/1000);
        let endtime=Math.round(n.getTime()+(1000*1000)/1000);

        console.log(starttime);
        await auction.connect(alice).createAuction(1,parseEther(100),starttime,endtime);
        await auction.connect(alice).createAuction(2,parseEther(100),starttime,endtime);

        
        let auctionlist=await auction.getAuctionByStatus(true);
        console.log({auctionlist});
        ethers.provider.send("evm_increaseTime", [30*24*60*60]);//10s
        ethers.provider.send("evm_mine",[]);  

        await token.connect(bob).approve(auction.address, parseEther(1 * 10 ** 6));
        let auctionid=auctionlist[0].auctionId;
        await auction.connect(bob).joinAuction(auctionid,parseEther(101));
        console.log(auctionid);


        //let auctionlistAfter=await auction.getAuctionByStatus(true);
        //console.log({auctionlistAfter});

        //expect(await token.balanceOf(auction.address)).equal(parseEther(500 * 10 ** 3));

    });

});
