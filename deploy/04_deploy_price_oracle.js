module.exports = async ({getNamedAccounts, hardhatArguments, deployments, ethers, config}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const net = hardhatArguments && hardhatArguments.network || config.defaultNetwork;
    const netConfig = config.networks[net];

    let oracleAddress;
    // check if there is a USD oracle in the config
    if (netConfig && netConfig.usdOracle) {
        oracleAddress = netConfig.usdOracle;
        console.log('Using USD Oracle with address: ', oracleAddress);
    } else {
        // No USD oracle ... deploy DummyOracle with 1 ETH == 2000 USD
        const dummyOracle = await deploy('DummyOracle', {
            from: deployer,
            args: [ethers.BigNumber.from('200000000000')],
            log: true,
        })
        oracleAddress = dummyOracle.address;
        console.log('Using DummyOracle with address: ', oracleAddress);
    }

    // 1 character names = $1000 (or 1000 * 1e18 attousd)
    // 2 character names = $500
    // 3 or more = $100
    const prices = [
        ethers.BigNumber.from('1000000000000000000000'),
        ethers.BigNumber.from('500000000000000000000'),
        ethers.BigNumber.from('100000000000000000000')
    ];

    await deploy('StablePriceOracle', {
        from: deployer,
        args: [oracleAddress, prices],
        log: true,
    });
};

module.exports.tags = ['StablePriceOracle'];