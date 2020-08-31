var bitcoin = require('bitcoinjs-lib');
var bip39 = require('bip39');

var assert = require('assert');


describe('bitcoinjs-lib (addresses)', () => {

    it('can generate a P2SH, pay-to-multisig (2-of-3) address', () => {
        const pubkeys = [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        ].map(hex => Buffer.from(hex, 'hex'));
        const { address } = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
        });
    
        assert.strictEqual(address, '36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7');
      });


    it('can generate a Segwit address', () => {
      const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seedData = bip39.mnemonicToSeedSync(mnemonic);
    const root = bitcoin.bip32.fromSeed(seedData);

    const pathData = "m/49'/1'/0'/0/0";
    const child = root.derivePath(pathData);


    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    
        assert.strictEqual(address, 'bc1q8zt37uunpakpg8vh0tz06jnj0jz5jddn7ayctz');
      });
    

});
