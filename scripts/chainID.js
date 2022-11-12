// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const ChainID = await hre.ethers.getContractFactory("ChainID");
  const chainID = await ChainID.deploy();
  await chainID.deployed();

  console.log("ChainID contract deployed address is", chainID.address);

  await chainID._chainID();

  const result = await chainID.a();

  console.log("The chainID of the test environment is", result);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
