const { ethers } = require("hardhat");

async function main() {
  const ContractB = await ethers.getContractFactory("ContractB");
  const contractB = await ContractB.deploy();
  await contractB.deployed();
  console.log("ContractB deployed to:", contractB.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
