module.exports = async ({getNamedAccounts, hardhatArguments, deployments, ethers, config}) => {
  const {execute} = deployments;
  const {deployer} = await getNamedAccounts();

  const ForeverRegistrarController = await deployments.get('ForeverRegistrarController');
  await execute(
    'BaseRegistrarImplementation',
    {from: deployer, log: true},
    'addController',
    ForeverRegistrarController.address
  );

};

module.exports.tags = ['FinalizeForeverController'];
module.exports.skip = function (hre) {
  return hre.network.name !== 'hardhat' && !process.argv.includes('FinalizeForeverController');
}
module.exports.runAtTheEnd = true;
