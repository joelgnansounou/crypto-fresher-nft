const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoFresher", () => {
  async function deployContractFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const CryptoFresher = await ethers.getContractFactory("CryptoFresher");
    const cryptoFresher = await CryptoFresher.deploy();

    return { cryptoFresher, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      expect(await cryptoFresher.owner()).to.equal(owner.address);
    });

    it("Should grant MINTER_ROLE to the owner", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      const hasMinterRole = await cryptoFresher.hasRole(
        cryptoFresher.MINTER_ROLE(),
        owner.address
      );

      expect(hasMinterRole).to.equal(true);
    });

    it("Should grant DEFAULT_ADMIN_ROLE to the owner", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      const hasAdminRole = await cryptoFresher.hasRole(
        cryptoFresher.DEFAULT_ADMIN_ROLE(),
        owner.address
      );

      expect(hasAdminRole).to.equal(true);
    });
  });

  describe("grantMinterRole", () => {
    describe("Validations", () => {
      it("Should throw when caller is not owner", async () => {
        const { cryptoFresher, otherAccount } = await loadFixture(
          deployContractFixture
        );

        expect(
          cryptoFresher
            .connect(otherAccount)
            .grantMinterRole(otherAccount.address)
        ).to.be.rejectedWith("You aren't the owner");
      });
    });

    it("Should grant Minter role to the given address", async () => {
      const { cryptoFresher, otherAccount } = await loadFixture(
        deployContractFixture
      );

      await cryptoFresher.grantMinterRole(otherAccount.address);

      const hasMinterRole = await cryptoFresher.hasRole(
        cryptoFresher.MINTER_ROLE(),
        otherAccount.address
      );

      expect(hasMinterRole).to.equal(true);
    });
  });

  describe("revokeMinterRole", () => {
    describe("Validations", () => {
      it("Should throw when caller is not owner", async () => {
        const { cryptoFresher, otherAccount } = await loadFixture(
          deployContractFixture
        );

        expect(
          cryptoFresher
            .connect(otherAccount)
            .revokeMinterRole(otherAccount.address)
        ).to.be.rejectedWith("You aren't the owner");
      });
    });

    it("Should revoke Minter role from the given address", async () => {
      const { cryptoFresher, otherAccount } = await loadFixture(
        deployContractFixture
      );

      await cryptoFresher.revokeMinterRole(otherAccount.address);

      const hasMinterRole = await cryptoFresher.hasRole(
        cryptoFresher.MINTER_ROLE(),
        otherAccount.address
      );

      expect(hasMinterRole).to.equal(false);
    });
  });

  describe("mint", () => {
    describe("Validations", () => {
      it("Should throw when caller don't have MINTER_ROLE", async () => {
        const { cryptoFresher, otherAccount } = await loadFixture(
          deployContractFixture
        );

        expect(
          cryptoFresher.connect(otherAccount).mint(otherAccount.address)
        ).to.be.rejectedWith("You must have the minter role");
      });
    });

    it("Should mint one NFT to the given address", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      const initialBalance = await cryptoFresher.balanceOf(owner.address);
      await cryptoFresher.mint(owner.address);
      const finalBalance = await cryptoFresher.balanceOf(owner.address);

      expect(Number(finalBalance)).to.equal(Number(initialBalance) + 1);
    });
  });

  describe("bulkMint", () => {
    describe("Validations", () => {
      it("Should throw when caller don't have MINTER_ROLE", async () => {
        const { cryptoFresher, otherAccount } = await loadFixture(
          deployContractFixture
        );

        expect(
          cryptoFresher.connect(otherAccount).bulkMint(otherAccount.address)
        ).to.be.rejectedWith("You must have the minter role");
      });
    });

    it("Should mint the provided number of NFTs to the given address", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      const amount = 3;
      const initialBalance = await cryptoFresher.balanceOf(owner.address);
      await cryptoFresher.bulkMint(owner.address, amount);
      const finalBalance = await cryptoFresher.balanceOf(owner.address);

      expect(Number(finalBalance)).to.equal(Number(initialBalance) + amount);
    });
  });

  describe("getOwnedTokens", () => {
    it("Should return the list of tokens owned by the given address", async () => {
      const { cryptoFresher, owner } = await loadFixture(deployContractFixture);

      await cryptoFresher.bulkMint(owner.address, 3);
      const balance = await cryptoFresher.balanceOf(owner.address);
      const tokens = await cryptoFresher.getOwnedTokens(owner.address);

      expect(Number(balance)).to.equal(tokens.length);
    });
  });
});
