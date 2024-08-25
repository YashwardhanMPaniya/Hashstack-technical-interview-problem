const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Contract Upgrade and Functionality", function () {
  let ContractA, ContractB, contractA, contractB, deployer, otherAccount;

  beforeEach(async function () {
    [deployer, otherAccount] = await ethers.getSigners();

    // Deploy ContractB
    const ContractBFactory = await ethers.getContractFactory("ContractB");
    contractB = await ContractBFactory.deploy();
    await contractB.deployed();

    // Deploy ContractA
    const ContractAFactory = await ethers.getContractFactory("ContractA");
    contractA = await upgrades.deployProxy(ContractAFactory, { kind: "uups" });
    await contractA.deployed();
  });

  it("should return 0 initially", async function () {
    expect(await contractA.getValue()).to.equal(0);
  });

  it("should set value to 10 and fetch it", async function () {
    await contractA.setValue(10);
    expect(await contractA.getValue()).to.equal(10);
  });

  it("should fetch the admin address of ContractA", async function () {
    const adminAddress = await contractA.owner();
    expect(adminAddress).to.equal(deployer.address);
  });

  it("should upgrade ContractA to inherit ContractB and change admin address", async function () {
    // Upgrade ContractA to inherit ContractB
    const ContractAUpdatedFactory = await ethers.getContractFactory(
      "ContractAUpdated"
    );
    const contractAUpdated = await upgrades.upgradeProxy(
      contractA.address,
      ContractAUpdatedFactory
    );

    // Ensure the upgrade was successful
    expect(
      await contractAUpdated.getRoleMember(contractAUpdated.ADMIN_ROLE(), 0)
    ).to.equal(deployer.address);

    // Change admin address in ContractB
    await contractB.addAdmin(otherAccount.address);
    await contractAUpdated.connect(otherAccount).setValue(20);

    // Transfer admin role in ContractB
    await contractB.transferAdminRole(otherAccount.address);

    // Ensure admin address has changed
    expect(
      await contractAUpdated.getRoleMember(contractAUpdated.ADMIN_ROLE(), 0)
    ).to.equal(otherAccount.address);
  });

  it("should return 10 after setting value to 10", async function () {
    await contractA.setValue(10);
    expect(await contractA.getValue()).to.equal(10);
  });

  it("should set value to 81 and verify the updated value is 91", async function () {
    await contractA.setValue(10);
    await contractA.setValue(81);
    expect(await contractA.getValue()).to.equal(91);
  });
});
