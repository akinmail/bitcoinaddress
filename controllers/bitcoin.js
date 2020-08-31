const validator = require('validator');
var bitcoin = require('bitcoinjs-lib');
var bip39 = require('bip39');

var testnet = bitcoin.networks.testnet





/**
 * POST /segwit
 * Create a Segwit address.
 */
exports.postSegwit = (req, res) => {
    const validationErrors = [];
    let seed;
    let path;
    
    if (validator.isEmpty(req.body.seed)) validationErrors.push({ msg: 'Please enter valid seed words' });
    if (!bip39.validateMnemonic(req.body.seed)) validationErrors.push({ msg: 'Please enter valid seed words' });

    if (validator.isEmpty(req.body.path)) validationErrors.push({ msg: 'Please enter a valid path.' });
  
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      //todo
      return res.redirect('/segwit');
    }
  
    const mnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seedData = bip39.mnemonicToSeedSync(mnemonic);
    const root = bitcoin.bip32.fromSeed(seedData);

    const pathData = "m/49'/1'/0'/0/0";
    const child = root.derivePath(pathData);


    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    console.log(address)

    root.toWIF();
  
    res.render('segwit', {
        address: address
      });
  };
  

  /**
 * GET /segwit
 * Segwit page.
 */
exports.getSegwit = (req, res) => {
    res.render('segwit', {
      title: 'Segwit Address Generator'
    });
  };

 /**
 * GET /p2sh
 * P2SH page.
 */
exports.getP2SH = (req, res) => {
    res.render('p2SHfirst', {
      title: 'p2SH Address Generator'
    });
  };

/**
 * POST /p2sh
 * Create a p2sh address.
 */
exports.postP2sh = (req, res) => {
    const validationErrors = [];
    let m;
    let n;
    
    if (validator.isEmpty(req.body.m)) validationErrors.push({ msg: 'Please enter valid m' });
    if (validator.isEmpty(req.body.n)) validationErrors.push({ msg: 'Please enter valid n' });


    if (validator.isEmpty(req.body.pubkeys)) validationErrors.push({ msg: 'Please enter valid pubkeys.' });
    var pubKeys = req.body.pubkeys.split(",").map(function(item) {
        return item.trim();
      });
    if (req.body.n != pubKeys.length) validationErrors.push({ msg: 'No of pubkeys must be equal to n' });
  
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
    
      return res.redirect('/p2sh');
    }
    console.log(pubKeys)
    console.log(req.body.m)

    /*pubKeys.map(hex => Buffer.from(hex, 'hex'));
      const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: req.body.m, pubKeys }),
      });*/
      const pubkeys = pubKeys.map(hex => Buffer.from(hex, 'hex'));
      const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
      });
      
    console.log(address)

  
    res.render('p2SHfirst', {
        address: address
      });
  };
  