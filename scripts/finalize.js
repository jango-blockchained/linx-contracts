// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {getNamedAccounts, hardhatArguments, deployments, web3, ethers, config} = hre;
const fs = require('fs');

async function main() {
    const {deployer} = await getNamedAccounts();
    const getContract = async (name) => {
        const contract = await deployments.get(name);
        return ethers.getContractAt(contract.abi, contract.address);
    }

    const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

    const ens = await getContract('ENSRegistry');
    const registrar = await getContract('BaseRegistrarImplementation');
    const reverse = await getContract('ReverseRegistrar');
    const controller = await getContract('ETHRegistrarController');
    const resolver = await getContract('PublicResolver');

    console.log('Generating addresses.json file ...');
    const net = hardhatArguments && hardhatArguments.network || config.defaultNetwork;
    fs.writeFileSync('addresses.json', JSON.stringify({
        network: net,
        addresses: {
            ens: ens.address,
            registrar: registrar.address,
            controller: controller.address,
            resolver: resolver.address,
            reverse: reverse.address
        }
    }, null, 2), err => {
        if (err) {
            console.error(err);
        }
    });

    console.log('setting ' + config.tld + ' owner to registrar address ' + registrar.address);
    await ens.setSubnodeOwner(ZERO, web3.utils.sha3(config.tld), registrar.address);

    console.log('setting .reverse owner to deployer account address ' + deployer);
    await ens.setSubnodeOwner(ZERO, web3.utils.sha3('reverse'), deployer);

    console.log('setting addr.reverse owner to ReverseRegistrar address ' + reverse.address);
    await ens.setSubnodeOwner(ethers.utils.namehash('reverse'), web3.utils.sha3('addr'), reverse.address);

    console.log('adding ETHRegistrarController to the BaseRegistrar');
    await registrar.addController(controller.address);

    console.log('use PublicResolver in the BaseRegistrar');
    await registrar.setResolver(resolver.address);

    // Optional for later setting ReverseRegistrar and ENSRegistry owners to burn address
    // console.log('Setting .reverse owner to burn address');
    // await ens.setSubnodeOwner(ZERO, web3.utils.sha3('reverse'), EMPTY_ADDRESS);
    //
    // console.log('Setting registry owner to burn address')
    // await ens.setOwner(ZERO, EMPTY_ADDRESS);

    console.log('Done!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
