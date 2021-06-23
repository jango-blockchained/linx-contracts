const ENS = artifacts.require('./registry/ENSRegistry');
const BaseRegistrar = artifacts.require('./BaseRegistrarImplementation');
const DummyOracle = artifacts.require('./DummyOracle');
const StablePriceOracle = artifacts.require('./StablePriceOracle');

const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;
const toBN = require('web3-utils').toBN;

contract('StablePriceOracle', function (accounts) {
    let priceOracle;

    before(async () => {
        ens = await ENS.new();
        registrar = await BaseRegistrar.new(ens.address, namehash.hash('eth'));

        // Dummy oracle with 1 ETH == 10 USD
        var dummyOracle = await DummyOracle.new(toBN(1000000000));
        // 400 attousd for 3 character names, 200 attousd for 4 character names,
        // 100 attousd for longer names.
        priceOracle = await StablePriceOracle.new(dummyOracle.address, [800, 600, 400, 200, 100]);
    });

    it('should return correct prices', async () => {
        assert.equal((await priceOracle.price("a")).toNumber(), 80);
        assert.equal((await priceOracle.price("cc")).toNumber(), 60);
        assert.equal((await priceOracle.price("foo")).toNumber(), 40);
        assert.equal((await priceOracle.price("quux")).toNumber(), 20);
        assert.equal((await priceOracle.price("fubar")).toNumber(), 10);
        assert.equal((await priceOracle.price("foobie")).toNumber(), 10);
    });

    it('should work with larger values', async () => {
        // 10 million USD!
        await priceOracle.setPrices([toBN("10000000000000000000000000")]);
        assert.equal((await priceOracle.price("foo")).toString(), "1000000000000000000000000");
    })
});
