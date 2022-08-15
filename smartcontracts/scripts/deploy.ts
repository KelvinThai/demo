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


    const Vault = await ethers.getContractFactory("ImpetusVault");
    const vault = await Vault.deploy('0xBfF3cC27180E6425377c55D7bDC069D18Ae7d99d');
    console.log('ImpetusVault address: ', vault.address);
    Config.setConfig(network + '.ImpetusVault', vault.address);
    await Config.updateConfig();

    
}

main().then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
