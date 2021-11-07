// main function
// Remember, when you run scripts/run.js it's actually
// 1. Creating a new local Ethereum network.
// 2. Deploying your contract.
// 3. Then, when the script ends Hardhat will automatically destroy that local network
const dotenv = require('dotenv');
dotenv.config();

const main = async () => {
  // get the owner who deployed the contracts address & a random person address
  const [owner, randomPerson, anotherRandomPerson] =
    await hre.ethers.getSigners();

  console.log(process.env.test);

  // compile contract
  // hre is the hardhat runtime environment object, it does not need to be imported. (injected by Hardhat)
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');

  // run & deploy on local blockchain
  // this local blockchain runs and is destroyed everytime you deploy, so no data stays from deploy to deploy.
  const waveContract = await waveContractFactory.deploy();

  // wait for it to be deployed
  await waveContract.deployed();
  console.log('Contract deployed to:', waveContract.address);
  console.log('Contract deployed by:', owner.address);

  // call functions
  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  // owner calls the function
  waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  // randomPerson calls the function
  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  // anotherRandomPerson calls the function
  waveTxn = await waveContract.connect(anotherRandomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
};

// run main in an async try-catch function runMain
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
