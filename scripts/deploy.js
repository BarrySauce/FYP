// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

async function main() {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }

  const Receiver = await hre.ethers.getContractFactory("Receiver");
  const receiver = await Receiver.deploy();
  await receiver.deployed();

  console.log("Receiver contract deployed address is", receiver.address);

  const initialSupply = "100000000000000000000"; //1000 * 10^18

  const TokenA = await hre.ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.connect(accounts[0]).deploy(receiver.address, accounts[3].address, initialSupply);
  await tokenA.deployed();

  console.log("TKA contract deployed address is", tokenA.address);

  const TokenB = await hre.ethers.getContractFactory("TokenA");
  const tokenB = await TokenB.connect(accounts[0]).deploy(receiver.address, accounts[4].address, initialSupply);
  await tokenB.deployed();

  console.log("TKB contract deployed address is", tokenB.address);

  const TokenC = await hre.ethers.getContractFactory("TokenA");
  const tokenC = await TokenC.connect(accounts[0]).deploy(receiver.address, accounts[5].address, initialSupply);
  await tokenC.deployed();

  console.log("TKC contract deployed address is", tokenC.address);

  const balanceTKA = await tokenA.balanceOf(accounts[3].address);
  console.log("Test Account 0 TKA balance is", balanceTKA);

  const balanceTKB = await tokenB.balanceOf(accounts[4].address);
  console.log("Test Account 1 TKB balance is", balanceTKB);

  const balanceTKC = await tokenC.balanceOf(accounts[5].address);
  console.log("Test Account 2 TKC balance is", balanceTKC);


  const etherBal_TestAccount0 = await hre.network.provider.request({
  method: "eth_getBalance",
  params: [accounts[3].address],
  });

  const hexToDecimal = hex => parseInt(hex, 16);
  const finalBalAccount0_decimal = hexToDecimal(etherBal_TestAccount0);

  console.log("The ether balance of test account 0 is", finalBalAccount0_decimal)




  const etherBal_TestAccount1 = await hre.network.provider.request({
  method: "eth_getBalance",
  params: [accounts[4].address],
  });


  const finalBalAccount1_decimal = hexToDecimal(etherBal_TestAccount1);

  console.log("The ether balance of test account 1 is", finalBalAccount1_decimal)




  const etherBal_TestAccount2 = await hre.network.provider.request({
  method: "eth_getBalance",
  params: [accounts[5].address],
  });


  const finalBalAccount2_decimal = hexToDecimal(etherBal_TestAccount2);

  console.log("The ether balance of test account 2 is", finalBalAccount2_decimal)

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
