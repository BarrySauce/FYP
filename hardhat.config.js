require("@nomicfoundation/hardhat-toolbox");


const PRIVATE_KEY0 = "9991280325e290e1d3a5ca5712a90e425ff32e8e460be68a492bbf5133a66f51";
const PRIVATE_KEY1 = "8bd81ba9f7f744c5f7890c5c2ee67519afb7527e3ee0b105daae6f543e26dc02";
const PRIVATE_KEY2 = "f059be9984f78484b5a3dbbf432e022ee127dfcf470e6deee76e08383679a7e5";
const PRIVATE_KEY3 = "08cb52e6ca3eda56e36441a5d3e6eb7f760cc0616f8a7961ea1c8a91f2dc2c97";
const PRIVATE_KEY4 = "a7e51f3d4952f1259afd0ecac149c4f0a38186315ca8a352d9bc9d0857213982";
const PRIVATE_KEY5 = "b60fe7d6c0ac3fe266a7e875d13db1b1569486197f2275d582b3c3343eb48757";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers:[
      {
        version: "0.8.0"
      },
    ],
  },

  networks: {
    ganache:{
      url: 'http://127.0.0.1:7545',
      accounts: [PRIVATE_KEY0,PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3,PRIVATE_KEY4,PRIVATE_KEY5],
      chainId: 1337
    },
  },
};
