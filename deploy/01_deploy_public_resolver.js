// deploy/01_deploy_public_resolver.js
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const ENSRegistry = await deployments.get('ENSRegistry');
    await deploy('PublicResolver', {
        from: deployer,
        args: [ENSRegistry.address],
        log: true,
    });
};

module.exports.tags = ['PublicResolver'];
module.exports.dependencies = ['ENSRegistry'];