usePlugin('@nomiclabs/buidler-truffle5')

task('deployToken', 'Deploys a token contract')
  .addParam('amount', 'Initial supply of tokens')
  .setAction(async (taskArgs) => {

    const Token = artifacts.require('Token')

    const { amount } = taskArgs
    console.log('I love me')
    console.log(amount)

    const accounts = await ethereum.send('eth_accounts')
    return await Token.new(amount, { from: accounts[0] })
  })

// beneficiary -> string
// start -> int
// cliffDuration -> int
// duration -> int
task('deployVesting', 'Deploys a vesting contract based on provided params')
  .addParam('beneficiary', 'Recipient of vesting tokens')
  .addParam('start', 'Unix timestamp in seconds of vesting start')
  .addParam('cliffDuration', 'Unix timestamp in seconds of cliff duration')
  .addParam('duration', 'Unix timestamp in seconds of vesting duration')
  .setAction(async (taskArguments) => {

    const TokenVesting = artifacts.require("TokenVesting")

    const { beneficiary, start, cliffDuration, duration } = taskArguments
    console.log('I love you')
    console.log(beneficiary)
    console.log(start)
    console.log(cliffDuration)
    console.log(duration)

    const accounts = await ethereum.send('eth_accounts')

    await TokenVesting.new(beneficiary, start, cliffDuration, duration, true, { from: accounts[0] })
  })

task('transferToken', 'Transfers tokens to the provided address')
  .addParam('tokenAddress', 'Token contract address')
  .addParam('recipient', 'Recipient address')
  .addParam('amount', 'Amount of tokens to transfer')
  .setAction(async (taskArguments) => {
    const { tokenAddress, recipient, amount } = taskArguments

    const IERC20 = artifacts.require("IERC20")

    const token = IERC20.at(tokenAddress)

    return await token.transfer(recipient, amount)
  })

task('set_owner', 'Sets the owner of the vesting contract')
  .addParam('vestingAddress', 'Vesting contract address')
  .addParam('newOwner', 'New owner address')
  .setAction(async (taskArguments) => {
    const { vestingAddress, newOwner } = taskArguments

    const TokenVesting = artifacts.require("TokenVesting")
    const vesting = TokenVesting.at(vestingAddress)

    const accounts = await ethereum.send('eth_accounts')

    await vesting.transferOwnership(newOwner)
  })

task('accounts', 'Prints a list of the available accounts', async () => {
  const accounts = await ethereum.send('eth_accounts')

  console.log('Accounts:', accounts)
})

module.exports = {}
