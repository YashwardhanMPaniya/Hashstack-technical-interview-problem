const { ethers, upgrades } = require("hardhat");

async function main() {
  const ContractA = await ethers.getContractFactory("ContractA");
  const proxy = await upgrades.deployProxy(ContractA, { initializer: false });
  await proxy.deployed();
  console.log("ContractA Proxy deployed to:", proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
