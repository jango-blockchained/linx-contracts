module.exports = async ({getNamedAccounts, hardhatArguments, deployments, ethers, config}) => {
  const {execute} = deployments;
  const {deployer} = await getNamedAccounts();

  const ROOT_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';

  const BaseRegistrarImplementation = await deployments.get('BaseRegistrarImplementation');
  const ReverseRegistrar = await deployments.get('ReverseRegistrar');
  const ETHRegistrarController = await deployments.get('ETHRegistrarController');

  // Assign BaseRegistrarImplementation as the owner of the TLD
  await execute(
    'ENSRegistry',
    {from: deployer, log: true},
    'setSubnodeOwner',
    ROOT_NODE,
    ethers.utils.id(config.tld),
    BaseRegistrarImplementation.address
  );

  // Assign deployer as the owner of .reverse TLD
  await execute(
    'ENSRegistry',
    {from: deployer, log: true},
    'setSubnodeOwner',
    ROOT_NODE,
    ethers.utils.id('reverse'),
    deployer
  );

  // Assign ReverseRegistrar as the owner of addr.reverse
  await execute(
    'ENSRegistry',
    {from: deployer, log: true},
    'setSubnodeOwner',
    ethers.utils.namehash('reverse'),
    ethers.utils.id('addr'),
    ReverseRegistrar.address
  );

  // Enable ETHRegistrarController
  await execute(
    'BaseRegistrarImplementation',
    {from: deployer, log: true},
    'addController',
    ETHRegistrarController.address
  );

  // Assign PublicResolver for the TLD node
  await execute(
    'BaseRegistrarImplementation',
    {from: deployer, log: true},
    'setResolver',
    (await deployments.get('PublicResolver')).address
  );

  // Make .reverse owner-less
  await execute(
    'ENSRegistry',
    {from: deployer, log: true},
    'setOwner',
    ethers.utils.namehash('reverse'),
    BURN_ADDRESS
  );

  // Make ENSRegistry owner-less
  await execute(
    'ENSRegistry',
    {from: deployer, log: true},
    'setOwner',
    ROOT_NODE,
    BURN_ADDRESS
  );
};

module.exports.tags = ['FinalizeInitial'];
module.exports.skip = function (hre) {
  return hre.network.name !== 'hardhat' && !process.argv.includes('FinalizeInitial');
}
module.exports.runAtTheEnd = true;
