# BlockVote 🤝🏻
BlockVote is a blockchain based election system which lets voters elect candidate in an election.

![](https://img.shields.io/github/languages/code-size/iSumitBanik/BlockVote?style=flat-square) ![](https://img.shields.io/github/stars/iSumitBanik/BlockVote?style=flat-square) ![](https://img.shields.io/github/last-commit/iSumitBanik/BlockVote?style=flat-square) ![](https://img.shields.io/github/followers/iSumitBanik?style=flat-square)

### Technology Stack 🎨
1. [BootStrap](https://getbootstrap.com/) 
2. [Truffle](https://www.trufflesuite.com/) 
3. Ganache 

### How to use it? 🎉

>Make Sure that you've Truffle and Ganache installed

1. Clone the repo: `git clone https://github.com/iSumitBanik/BlockVote.git`
2. Navigate to the folder: `cd BlockVote`
3. Install dependencies: `npm install` along with ganache-cli installing using the command `npm install ganache-cli -g`
4. Open a new terminal window and run `ganache-cli` command, keep it running in the background.
  4.1 On another window,run the deploy  contract using: `truffle migrate --reset`
5. Spin up the Blockvote application by running: `npm run dev`
6. To Cast Vote, 

    6.1 First Connect to localhost:8545 network in Metamask.
    
    6.2 Secondly, copy one of the private key from the Ganache cli console and import it in the Metamask account section.
  
    6.3 You should see 99-100 ETH in your address once you import it.
  
    6.4 Manually connect Metamask to the cast vote page by clicking on the `Not Connected` option which is shown left side of your address.
  
    6.5 Once it shows connected, you can successfully cast your vote.
