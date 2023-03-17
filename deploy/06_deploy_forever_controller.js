module.exports = async ({getNamedAccounts, hardhatArguments, deployments, ethers, config}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const registrar = await deployments.get('BaseRegistrarImplementation');
  const priceOracle = await deployments.get('StablePriceOracle');
  const minCommitmentAge = 60;
  const maxCommitmentAge = 604800;

  await deploy('ForeverRegistrarController', {
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

module.exports.tags = ['ForeverRegistrarController'];
module.exports.dependencies = ['BaseRegistrarImplementation', 'StablePriceOracle'];
