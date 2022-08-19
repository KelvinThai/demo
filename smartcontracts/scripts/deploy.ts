import { ethers, hardhatArguments } from 'hardhat';
import * as Config from './config';

async function main() {
    await Config.initConfig();
    const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
    const [deployer] = await ethers.getSigners();
    console.log('deploy from address: ', deployer.address);


    // const Impetus = await ethers.getContractFactory("ImpetusToken");
    // const impetus = await Impetus.deploy();
    // console.log('Impetus address: ', impetus.address);
    // Config.setConfig(network + '.Impetus', impetus.address);


    // const Vault = await ethers.getContractFactory("ImpetusVault");
    // const vault = await Vault.deploy('0xBfF3cC27180E6425377c55D7bDC069D18Ae7d99d');
    // console.log('ImpetusVault address: ', vault.address);
    // Config.setConfig(network + '.ImpetusVault', vault.address);


    // const ImpetusCrowdSale = await ethers.getContractFactory("ImpetusCrowdSale");
    // const impetusCrowdSale = await ImpetusCrowdSale.deploy(1000,100,'0xAc3A19dde2e3ddfdd77b35DAA110ef46976c1CAb','0xBfF3cC27180E6425377c55D7bDC069D18Ae7d99d');
    // console.log('ImpetusCrowdSale address: ', impetusCrowdSale.address);
    // Config.setConfig(network + '.impetusCrowdSale', impetusCrowdSale.address);

    // const ImpetusStaking = await ethers.getContractFactory("ImpetusStaking");
    // const impetusStaking = await ImpetusStaking.deploy('0xBfF3cC27180E6425377c55D7bDC069D18Ae7d99d');
    // console.log('ImpetusCrowdSale address: ', impetusStaking.address);
    // Config.setConfig(network + '.impetusStaking', impetusStaking.address);

    const ImpetusLending = await ethers.getContractFactory("ImpetusLending");
    const impetusLending = await ImpetusLending.deploy('0xBfF3cC27180E6425377c55D7bDC069D18Ae7d99d','0x337610d27c682E347C9cD60BD4b3b107C9d34dDd');
    console.log('ImpetusLending address: ', impetusLending.address);
    Config.setConfig(network + '.impetusLending', impetusLending.address);

    await Config.updateConfig();
}

main().then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
