# .forever contracts

This is a fork of [ens contracts](https://github.com/ensdomains/ens-contracts) that allows you to register your name once and own it forever without the need for renewals.

For documentation of the ENS system, see [docs.ens.domains](https://docs.ens.domains/).

## npm package

This repo doubles as an npm package with the compiled JSON contracts

```js
import {
  BaseRegistrar,
  BaseRegistrarImplementation,
  ENS,
  ENSRegistry,
  ENSRegistryWithFallback,
  ETHRegistrarController,
  FIFSRegistrar,
  PriceOracle,
  PublicResolver,
  Resolver,
  ReverseRegistrar,
  StablePriceOracle,
  TestRegistrar
} from '@ensdomains/ens-contracts'
```

## Importing from solidity

```
// Registry
import 'ensdomains-ens-contracts/contracts/registry/ENS.sol';
import 'ensdomains-ens-contracts/contracts/registry/ENSRegistry.sol';
import 'ensdomains-ens-contracts/contracts/registry/ENSRegistryWithFallback.sol';
import 'ensdomains-ens-contracts/contracts/registry/ReverseRegistrar.sol';
import 'ensdomains-ens-contracts/contracts/registry/TestRegistrar.sol';
// EthRegistrar
import 'ensdomains-ens-contracts/contracts/ethregistrar/BaseRegistrar.sol';
import 'ensdomains-ens-contracts/contracts/ethregistrar/BaseRegistrarImplementation.sol';
import 'ensdomains-ens-contracts/contracts/ethregistrar/BaseRegistrar.sol';
import 'ensdomains-ens-contracts/contracts/ethregistrar/ETHRegistrarController.sol';
import 'ensdomains-ens-contracts/contracts/ethregistrar/PriceOracle.sol';
import 'ensdomains-ens-contracts/contracts/ethregistrar/StablePriceOracle.sol';
// Resolvers
import 'ensdomains-ens-contracts/contracts/resolvers/PublicResolver.sol';
import 'ensdomains-ens-contracts/contracts/resolvers/Resolver.sol';
```

##  Accessing to binary file.

If your environment does not have compiler, you can access to the raw hardhat artifacts files at `node_modules/@ensdomains/ens-contracts/artifacts/contracts/${modName}/${contractName}.sol/${contractName}.json`


## Contracts

## Registry

The ENS registry is the core contract that lies at the heart of ENS resolution. All ENS lookups start by querying the registry. The registry maintains a list of domains, recording the owner, resolver, and TTL for each, and allows the owner of a domain to make changes to that data. It also includes some generic registrars.

### ENS.sol

Interface of the ENS Registry.

### ENSRegistry

Implementation of the ENS Registry, the central contract used to look up resolvers and owners for domains.

### ENSRegistryWithFallback

The new impelmentation of the ENS Registry after [the 2020 ENS Registry Migration](https://docs.ens.domains/ens-migration-february-2020/technical-description#new-ens-deployment).

### FIFSRegistrar

Implementation of a simple first-in-first-served registrar, which issues (sub-)domains to the first account to request them.

### ReverseRegistrar

Implementation of the reverse registrar responsible for managing reverse resolution via the .addr.reverse special-purpose TLD.


### TestRegistrar

Implementation of the `.test` registrar facilitates easy testing of ENS on the Ethereum test networks. Currently deployed on Ropsten network, it provides functionality to instantly claim a domain for test purposes, which expires 28 days after it was claimed.


## EthRegistrar

Implements an [ENS](https://ens.domains/) registrar intended for the .eth TLD.

These contracts were audited by ConsenSys dilligence; the audit report is available [here](https://github.com/ConsenSys/ens-audit-report-2019-02).

### BaseRegistrar

BaseRegistrar is the contract that owns the TLD in the ENS registry. This contract implements a minimal set of functionality:

 - The owner of the registrar may add and remove controllers.
 - Controllers may register new domains. They can not change the ownership of existing domains.
 - Name owners may transfer ownership to another address.
 - Name owners may reclaim ownership in the ENS registry if they have lost it.
 - Owners of names in the interim registrar may transfer them to the new registrar, during the 1 year transition period. When they do so, their deposit is returned to them in its entirety.

This separation of concerns provides name owners strong guarantees over continued ownership of their existing names, while still permitting innovation and change in the way names are registered via the controller mechanism.

### EthRegistrarController

EthRegistrarController is the first implementation of a registration controller for the new registrar. This contract implements the following functionality:

 - The owner of the registrar may set a price oracle contract, which determines the cost of registrations based on the name.
 - The owner of the registrar may withdraw any collected funds to their account.
 - Users can register new names using a commit/reveal process and by paying the appropriate registration fee.

The commit/reveal process is used to avoid frontrunning, and operates as follows:

 1. A user commits to a hash, the preimage of which contains the name to be registered and a secret value.
 2. After a minimum delay period and before the commitment expires, the user calls the register function with the name to register and the secret value from the commitment. If a valid commitment is found and the other preconditions are met, the name is registered.

The minimum delay and expiry for commitments exist to prevent miners or other users from effectively frontrunnig registrations.

### SimplePriceOracle

SimplePriceOracle is a trivial implementation of the pricing oracle for the EthRegistrarController that always returns a fixed price per domain per year, determined by the contract owner.

### StablePriceOracle

StablePriceOracle is a price oracle implementation that allows the contract owner to specify pricing based on the length of a name, and uses a fiat currency oracle to set a fixed price in fiat per name.

## Resolvers

Resolver implements a general-purpose ENS resolver that is suitable for most standard ENS use-cases. The public resolver permits updates to ENS records by the owner of the corresponding name.

PublicResolver includes the following profiles that implements different EIPs.

─ ABIResolver = EIP 205 - ABI support (`ABI()`).
─ AddrResolver = EIP 137 - Contract address interface. EIP 2304 - Multicoin support (`addr()`).
─ ContentHashResolver = EIP 1577 - Content hash support (`contenthash()`).
─ InterfaceResolver = EIP 165 - Interface Detection (`supportsInterface()`).
─ NameResolver = EIP 181 - Reverse resolution (`name()`).
─ PubkeyResolver = EIP 619 - SECP256k1 public keys (`pubkey()`).
─ TextResolver = EIP 634 - Text records (`text()`).
─ DNSResolver = Experimental support is available for hosting DNS domains on the Ethereum blockchain via ENS. [The more detail](https://veox-ens.readthedocs.io/en/latest/dns.html) is on the old ENS doc.

## Developer guide

### How to setup

```
git clone https://github.com/ensdomains/ens-contracts
cd ens-contracts
yarn
```
### Deployment
Update `hardhat.config.js` with your Infura API Key and Deployment account private key.

Specify the `--network` option like ropsten, mainnet, hardhat or localhost.

```
npx hardhat --network ropsten deploy 
```

Finalize deployment: updates ens registry  and connects the controller and public resolver to the registrar.

```
npx hardhat --network ropsten run scripts/finalize.js
```

Submit contract code to verify with etherscan (optional)

```
npx hardhat --network ropsten etherscan-verify --license MIT --api-key etherscan_api_key
```

Note: Deployed contract info are stored in `deployments` directory, running deploy again will reuse any contracts that were deployed previously.


### How to run tests

```
yarn test
```



### How to publish

```
yarn pub
```
