module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const ENSRegistry = await deployments.get('ENSRegistry');
    const PublicResolver = await deployments.get('PublicResolver');

    await deploy('ReverseRegistrar', {
        from: deployer,
        args: [ENSRegistry.address, PublicResolver.address],
        log: true,
    });
};

module.exports.tags = ['ReverseRegistrar'];
module.exports.dependencies = ['ENSRegistry', 'PublicResolver'];