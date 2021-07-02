module.exports = async ({getNamedAccounts, hardhatArguments, deployments, ethers, config}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const registrar = await deployments.get('BaseRegistrarImplementation');
    const priceOracle = await deployments.get('StablePriceOracle');
    const minCommitmentAge = 60;
    const maxCommitmentAge = 86400;

    await deploy('ETHRegistrarController', {
        from: deployer,
        args: [
            registrar.address,
            priceOracle.address,
            minCommitmentAge,
            maxCommitmentAge
        ],
        log: true,
    });
};

module.exports.tags = ['ETHRegistrarController'];
module.exports.dependencies = ['BaseRegistrarImplementation', 'StablePriceOracle'];