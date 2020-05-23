App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      App.listenForAccountChange();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },
  listenForAccountChange: function () {
    ethereum.on('accountsChanged', function (accounts) {
      App.account = accounts[0];
      App.render();
    })
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data

    web3.eth.getAccounts(function (err, account) {
      $("#accountAddress").html(`<span style="font-size:14px;">Your Voter's Address: 
      <span style="font-weight:600">${account[0]}</span></span><br><br>
      <small>(Refresh the page if you've migrated to new account)</small>`);
      App.account = account[0];
      $('#bv-address').text(`${App.account}`)
      document.getElementById("bv-qr-code").innerHTML = "";

      new QRCode(document.getElementById("bv-qr-code"), {
        text: `${App.account}`,
        width: 170,
        height: 170,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    });

    // Load contract data
    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[3];
          var party = candidate[2];
          // Render candidate Result
          var candidateTemplate =
            `<tr><th>${id}</th><td>${name}</td><td>${party}</td><td>${voteCount}</td></tr>`;
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = `<option value="${id}"> ${name} (${party}) </option>`
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        $('form').hide();
        $('#vote-msg').html(`<div class="col-sm-6 offset-sm-3 col-lg-6 offset-lg-3 col-md-6 offset-md-3">
        <div class="alert alert-danger text-center" role="alert">
          <span>You have already voted!</span>
        </div>
      </div>`)
        $('#bv-voted').text(`Yes`)
      }
      else {
        $('#bv-voted').text(`No`)

      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      //console.warn(error);
    });
  },

  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
      alert("Thanks for voting")
    }).catch(function (err) {
      console.error(err);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});