const SpendingCap = artifacts.require("SpendingCap");
const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();
const { advanceBlock,
    advanceBlockTo,
    latest,
    latestBlock,
    increase,
    increaseTo,
    duration } = require('./helpers/time');


// Token Variables
const tokenName = "Spending Cap";
const symbol = "SPCP";
const timelockdays = 10;
const spendingCapEther = 10;
const totalSupply = 10000;

let token;


contract('Crowdsale', ([deployer, investor1, investor2, investor3]) => {

    beforeEach(async () => {

        // Deploy token
        token = await SpendingCap.new(tokenName, symbol, timelockdays, spendingCapEther, totalSupply);

    });
    
    describe('Token attributes', () => {

        it('has correct symbol', async () => {

            const contractSymbol = await token.symbol();
            assert.equal(contractSymbol, symbol);

        });
        it('has correct time lock days', async () => {

            const contractTimeLockDays = parseInt(await token.timelock());
            const timestamp = await latest();
            const timestamp_and_lockout = timestamp.add(duration.days(10));
            assert.equal(contractTimeLockDays, timestamp_and_lockout);

        });
        it('has correct spending cap', async () => {

            const contractSpendingCap = await token.spendingCap();
            assert.equal(Number(contractSpendingCap), spendingCapEther * 10**18);

        });
        it('has correct total supply', async () => {

            const contractTotalSupply = await token.totalSupply();
            assert.equal(Number(contractTotalSupply), totalSupply * 10**18);

        });
    });

    // Test the transfers
    describe('Transfers before timelock', () => {

        it('should transfer the max and revert transfers after', async () => {

            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.fulfilled;
            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.rejectedWith('revert');

        });
    });


    describe('Transfers after the timelock should go over', () => {
        it('Should increase time and let >max transfers go through', async () => {

            console.log("Deployer: ", Number(await token.balanceOf(deployer) / 10**18));
            console.log("Investor1: ", Number(await token.balanceOf(investor1) / 10**18));
            console.log("");
            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.fulfilled;
            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.rejectedWith('revert');

            // Time Travel 1 Day
            let start = await latest();
            let end = start.add(duration.days(1));
            await increaseTo(end);
            console.log("Time Travel 1 Day");


            console.log("Deployer: ", Number(await token.balanceOf(deployer)) / 10**18);
            console.log("Investor1: ", Number(await token.balanceOf(investor1)) / 10**18);
            console.log("");

            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.fulfilled;
            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.rejectedWith('revert');

            console.log("Deployer: ", Number(await token.balanceOf(deployer) / 10**18));
            console.log("Investor1: ", Number(await token.balanceOf(investor1) / 10**18));
            console.log("");

            // Time Travel 10 Days
            start = await latest();
            end = start.add(duration.days(10));
            await increaseTo(end);
            console.log("Time Travel 10 Days");

            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.fulfilled;
            await token.transfer(investor1, web3.utils.toWei('10', 'ether'), { from: deployer }).should.be.fulfilled;

            console.log("Deployer: ", Number(await token.balanceOf(deployer) / 10**18));
            console.log("Investor1: ", Number(await token.balanceOf(investor1) / 10**18));

        });
    });


});