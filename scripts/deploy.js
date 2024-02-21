const { ethers } = require("hardhat");

async function main() {
  const cryptoFresher = await ethers.deployContract("CryptoFresher");
  await cryptoFresher.waitForDeployment();

  console.log(`CryptoFresher deployed to ${cryptoFresher.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
