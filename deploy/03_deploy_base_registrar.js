module.exports = async ({getNamedAccounts, deployments, ethers, config}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const ENSRegistry = await deployments.get('ENSRegistry');

    await deploy('BaseRegistrarImplementation', {
        from: deployer,
        args: [ENSRegistry.address, ethers.utils.namehash(config.tld)],
        log: true,
    });
};

module.exports.tags = ['BaseRegistrarImplementation'];
module.exports.dependencies = ['ENSRegistry'];