App = {
  web3Provider: null,
  contracts: {},
  contractAddress: '0x1a090f396452d87e7522c166687b1497a5e00768',

  init: function() {
    //App.Web3 = require('web3');
    document.getElementById('registerNewOffender-content').style.display='none';
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.log('MetaMask is not installed!');
    }

    if(typeof web3 !== 'undefined') {
      App.web3Provider = window.ethereum;
    }

    web3 = new Web3(App.web3Provider);
    (async () => {
      if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask is installed!");
      } else {
        console.log("MetaMask is not installed!");
      }
      accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      showAccount.innerHTML = account;
    });
    console.log('web3 version: '+web3.version);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('./json/OffenderRegistryABI.json', function(OffenderRegistryABIArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.OffenderRegistry = new web3.eth.Contract(OffenderRegistryABIArtifact,App.contractAddress);
      App.contracts.OffenderRegistry.defaultChain = 'goerli';

      App.contracts.OffenderRegistry.setProvider(App.web3Provider);

      App.contracts.OffenderRegistry.options.jsonInterface = OffenderRegistryABIArtifact;
      // listen to events
      //App.listenToEvents();
      // retrieve the article from the contract
      //return App.reloadArticles();
    });
    //$.getJSON('./json/OffenderRegistryABI.json', function(OffenderRegistryABIArtifact) {
      //App.contracts.OffenderRegistry.options.jsonInterface = OffenderRegistryABIArtifact;
    //})
  },

  displayCount: function() {
    console.log('displayCount');
    App.contracts.OffenderRegistry.methods.getNumberOfOfferders().call().then(function(numberOfOffenders) {
      console.log('count: '+numberOfOffenders);
      document.querySelector('#Count').innerHTML = numberOfOffenders;
    }).catch(function(err) {
      console.error(err.message);
    });
  },

  displayOffendersList: function() {
    console.log('displayOffendersList');
    App.contracts.OffenderRegistry.methods.getAllOffenders().call().then(function(offendersList) {
      console.log('List: '+offendersList);
      document.querySelector('#OffendersList').innerHTML = offendersList;
    }).catch(function(err) {
      console.error(err.message);
    });
  },

//TestName1,ABC123BCA,USA,UAE,Loan Defaulter,https://ipfs.moralis.io:2053/ipfs/QmbjWfWurK5Z3muoYvszXxcJNXFpsiznEGWhkXus9a1AHY/OffendersRegistryDappDocs/ABC123BCA.pdf

  encodeCreateOffenders: function() {
    console.log('get account');
    (async () => {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    });
    console.log('from account: '+accounts[0]);

    console.log('encodeCreateOffenders');
    name = document.getElementById("name").value;
    passportNumber = document.getElementById("passportNumber").value;
    passportCountry = document.getElementById("passportCountry").value;
    blacklistCountry = document.getElementById("blacklistCountry").value;
    offenceCategory = document.getElementById("offenceCategory").value;
    ipfsDocumentLink = document.getElementById("ipfsDocumentLink").value;
    var encodedValue = App.contracts.OffenderRegistry.methods.registerNewOffender(name, passportNumber, passportCountry,
      blacklistCountry, offenceCategory, ipfsDocumentLink)
    .encodeABI();
    console.log('encodedValue: '+encodedValue);

    console.log('estimate gas');
    App.contracts.OffenderRegistry.methods.registerNewOffender(name, passportNumber, passportCountry,
      blacklistCountry, offenceCategory, ipfsDocumentLink)
    .estimateGas({from: accounts[0]}).then(function(gasAmount){
        console.log('estimated gas:: '+gasAmount);
    })
    .catch(function(error){
        console.error(err.message);
    });

    console.log('send txn');
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: '0x1a090f396452d87e7522c166687b1497a5e00768',
            data: encodedValue
          },
        ],
      })
      .then((txHash) => {
        console.log(txHash);
        document.querySelector('#txnHash').innerHTML = txHash;
      })
      .catch((error) => console.error);

      return App.clearTextFields();
  },

  clearTextFields: function() {
    document.getElementById("name").value = '';
    document.getElementById("passportNumber").value= '';
    document.getElementById("passportCountry").value= '';
    document.getElementById("blacklistCountry").value= '';
    document.getElementById("offenceCategory").value= '';
    document.getElementById("ipfsDocumentLink").value= '';
  }

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
