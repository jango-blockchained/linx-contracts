// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const sha3 = require('web3-utils').sha3;

// Note: this deployment script is only intended for local testing
// use the deploy scripts in deploy/ instead.
async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const TLD = 'forever';

    // Deploying ENS
    const ENSContract = await hre.ethers.getContractFactory('ENSRegistry');
    const ens = await ENSContract.deploy();
    await ens.deployed();
    console.log("ENSRegistry deployed to:", ens.address);

    // Deploying PublicResolver
    const ResolverContract = await hre.ethers.getContractFactory('PublicResolver');
    const resolver = await ResolverContract.deploy(ens.address);
    console.log("PublicResolver deployed to:", resolver.address);

    // Deploying BaseRegistrarImplementation
    const BaseRegistrarContract = await hre.ethers.getContractFactory('BaseRegistrarImplementation');
    const registrar = await BaseRegistrarContract.deploy(ens.address, hre.ethers.utils.namehash(TLD));
    await registrar.deployed();
    console.log("BaseRegistrarImplementation deployed to:", registrar.address);

    // Deploying DummyOracle
    const DummyOracleContract = await hre.ethers.getContractFactory('DummyOracle');

    // DummyOracle with 1 ETH == 2000 USD
    const dummy = await DummyOracleContract.deploy(hre.ethers.BigNumber.from('200000000000'));
    await dummy.deployed();
    console.log("DummyOracle deployed to:", dummy.address);

    // Deploying StablePriceOracle
    const PriceOracleContract = await hre.ethers.getContractFactory('StablePriceOracle');
    // 1 character names = $1000 (or 1000 * 1e18 attousd)
    // 2 character names = $500
    // 3 or more = $100
    const price = await PriceOracleContract.deploy(dummy.address, [
            hre.ethers.BigNumber.from('1000000000000000000000'),
            hre.ethers.BigNumber.from('500000000000000000000'),
            hre.ethers.BigNumber.from('100000000000000000000')
        ]
    );
    await price.deployed();
    console.log("StablePriceOracle deployed to:", price.address);

    // Deploying ETHRegistrarController
    const ControllerContract = await hre.ethers.getContractFactory('ETHRegistrarController');
    const controller = await ControllerContract.deploy(registrar.address, price.address, 5, 86400);
    await controller.deployed();
    console.log("ETHRegistrarController deployed to:", controller.address);

    console.log('setting node owner to registrar address');
    await ens.setSubnodeOwner(ZERO, sha3(TLD), registrar.address);

    console.log('adding the controller to the base registrar');
    await registrar.addController(controller.address);

    console.log('set the public resolver');
    await registrar.setResolver(resolver.address);

    console.log('set owner');
    await ens.setOwner(ZERO, "0x0000000000000000000000000000000000000000");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
