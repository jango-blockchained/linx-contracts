// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    const {ens, registrar, controller, resolver} = await attach({
        // set your own contract addresses
        ens: '0x156Be5554638c57A1b00487cb2B6b3922C74bae6',
        resolver: '0x32221d052da43F08dee93f7FB49968Ef641f815c',
        registrar: '0x83AaDD122C50943743BF121ec0704d20515719C2',
        dummyOracle: '0x7e685a60949818068caee368e6937369E1e780f6',
        priceOracle: '0xCD1eCd6bEFc7EdF64475ed49C0f653d64915e7e6',
        controller: '0x0a9DE435C4ff31342c704e18E5fF9D1c7a96DA68',
    });

    // do something with contracts ...
}

async function attach(addrs) {
    const ENSContract = await hre.ethers.getContractFactory('ENSRegistry');
    const ens = await ENSContract.attach(addrs.ens);
    console.log("ENSRegistry attached to:", ens.address);

    const ResolverContract = await hre.ethers.getContractFactory('PublicResolver');
    const resolver = await ResolverContract.attach(addrs.resolver);
    console.log("PublicResolver attached to:", resolver.address);

    const BaseRegistrarContract = await hre.ethers.getContractFactory('BaseRegistrarImplementation');
    const registrar = await BaseRegistrarContract.attach(addrs.registrar);

    const DummyOracleContract = await hre.ethers.getContractFactory('DummyOracle');
    const dummyOracle = await DummyOracleContract.attach(addrs.dummyOracle);
    console.log("DummyOracle attached to:", dummyOracle.address);

    const PriceOracleContract = await hre.ethers.getContractFactory('StablePriceOracle');
    const priceOracle = await PriceOracleContract.attach(addrs.priceOracle);
    console.log("StablePriceOracle attached to:", priceOracle.address);

    // Deploying ETHRegistrar
    const ControllerContract = await hre.ethers.getContractFactory('ETHRegistrarController');
    const controller = await ControllerContract.attach(addrs.controller);
    console.log("ETHRegistrarController attached to:", controller.address);

    return {
        ens,
        controller,
        resolver,
        priceOracle,
        dummyOracle,
        registrar
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
