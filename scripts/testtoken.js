const hre = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

async function main() {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }



  const initialSupply = "100000000000000000000"; //1000 * 10^18

  const TokenT = await hre.ethers.getContractFactory("TokenT");
  const tokenT = await TokenT.connect(accounts[0]).deploy(accounts[0].address, accounts[1].address, initialSupply);
  await tokenT.deployed();

  console.log("TKT contract deployed address is", tokenT.address);

  const chainID = await tokenT._chainID();
  console.log("chainID of this network is", chainID);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
