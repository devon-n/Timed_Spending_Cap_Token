const SpendingCap = artifacts.require("SpendingCap");

module.exports = function (deployer) {

  // Token Variables
  const tokenName = "Spending Cap";
  const symbol = "SPCP";
  const timelockdays = 10;
  const spendingCapEther = 10;
  const totalSupply = 100;
  deployer.deploy(SpendingCap, tokenName, symbol, timelockdays, spendingCapEther, totalSupply);
};
