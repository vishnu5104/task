const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenVault", function () {
  let tokenInstance;
  let tokenVaultInstance;

  const initialBalance = ethers.parseEther("1000");
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("Mock");
    tokenInstance = await MockToken.deploy(owner.address, "MKT");

    await tokenInstance.waitForDeployment();

    const TokenVault = await ethers.getContractFactory("TokenVault");
    tokenVaultInstance = await TokenVault.deploy(tokenInstance.getAddress());
    await tokenVaultInstance.waitForDeployment();

    await tokenInstance.mint(owner.address, initialBalance);
  });

  it("should deposit tokens into the vault", async function () {
    const amountToDeposit = ethers.parseEther("100");
    await tokenInstance.connect(owner).approve(tokenVaultInstance.getAddress(), amountToDeposit);

    await tokenVaultInstance.connect(owner).deposit(amountToDeposit);

    const balance = await tokenInstance.balanceOf(tokenVaultInstance.getAddress());
    expect(balance).to.equal(amountToDeposit);
  });

  it("should withdraw tokens from the vault", async function () {
    const amountToDeposit = ethers.parseEther("100");
    const amountToWithdraw = ethers.parseEther("50");

    await tokenInstance.connect(owner).approve(tokenVaultInstance.getAddress(), amountToDeposit);
    await tokenVaultInstance.connect(owner).deposit(amountToDeposit);

    const ownerBalanceBefore = await tokenInstance.balanceOf(owner.getAddress());


    await tokenVaultInstance.connect(owner).withdraw(amountToWithdraw);

    const ownerBalanceAfter = await tokenInstance.balanceOf(owner.getAddress());

    console.log('the balance of owner after , before',ownerBalanceAfter,ownerBalanceBefore)

    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + amountToWithdraw);
});

  it("should not allow withdrawal of more tokens than deposited", async function () {
    const amountToDeposit = ethers.parseEther("100");
    const amountToWithdraw = ethers.parseEther("150");

    await tokenInstance.connect(owner).approve(tokenVaultInstance.getAddress(), amountToDeposit);
    await tokenVaultInstance.connect(owner).deposit(amountToDeposit);

    await expect(tokenVaultInstance.connect(owner).withdraw(amountToWithdraw)).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("should not allow deposits of 0 tokens", async function () {
    const amountToDeposit = ethers.parseEther("0");

    await expect(tokenVaultInstance.connect(owner).deposit(amountToDeposit)).to.be.revertedWith(
      "Amount must be greater than 0"
    );
  });

  it("should not allow withdrawals of 0 tokens", async function () {
    const amountToWithdraw = ethers.parseEther("0");

    await expect(tokenVaultInstance.connect(owner).withdraw(amountToWithdraw)).to.be.revertedWith(
      "Amount must be greater than 0"
    );
  });
});
