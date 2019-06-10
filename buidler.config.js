const cp = require('child_process')
const csv = require('csv')
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
'use strict'

usePlugin('@nomiclabs/buidler-truffle5')

// file -> string
task('orchestrate', 'Herps the derp then smokes some purp')
  .addParam('file', 'Path to csv file containing deployment data')
  .setAction(async (taskArgs) => {
    const SPANKCHAIN_MULTISIG = ''

    const { file } = taskArgs
    const raw = fs.readFileSync(file)
    const parsed = parse(raw, { columns: true, skip_empty_lines: true }).map((row) => {
      return Object.keys(row).reduce((transformed, header) => {
        transformed[header === 'SPANK' ? header : toCamelCase(header)] = row[header]
        return transformed
      }, {})
    })

    const deployed = await Promise.all(parsed.map(async (row) => {
      const vestingContract = await run('deployVesting', {
        beneficiary: row.address,
        start: Math.floor(new Date(row.startDate).getTime()),
        cliff_duration: row.cliff.replace(/,/g, ''),
        duration: row.duration.replace(/,/g, ''),
      })
      await run('setOwner', { vestingAddress: vestingContract.address, newOwner: SPANKCHAIN_MULTISIG })

      return `Name: ${row.name}, Wallet Address: ${row.address}, Vesting Address: ${vestingContract.address}`
    }))

    console.log(deployed)
  })

task('deployToken', 'Deploys a token contract')
  .addParam('amount', 'Initial supply of tokens')
  .setAction(async (taskArgs) => {
    const { amount } = taskArgs
  
    const Token = artifacts.require('Token')
    const accounts = await ethereum.send('eth_accounts')

    return await Token.new(amount, { from: accounts[0] })
  })

// beneficiary -> string
// start -> int
// cliff_duration -> int
// duration -> int
task('deployVesting', 'Deploys a vesting contract based on provided params')
  .addParam('beneficiary', 'Recipient of vesting tokens')
  .addParam('start', 'Unix timestamp in seconds of vesting start')
  .addParam('cliffDuration', 'Unix timestamp in seconds of cliff duration')
  .addParam('duration', 'Unix timestamp in seconds of vesting duration')
  .setAction(async (taskArguments) => {
    const { beneficiary, start, cliff_duration, duration } = taskArguments

    const TokenVesting = artifacts.require("TokenVesting")
    const accounts = await ethereum.send('eth_accounts')

    return await TokenVesting.new(beneficiary, start, cliff_duration, duration, true, { from: accounts[0] })
  })

task('transferToken', 'Transfers tokens to the provided address')
  .addParam('tokenAddress', 'Token contract address')
  .addParam('recipient', 'Recipient address')
  .addParam('amount', 'Amount of tokens to transfer')
  .setAction(async (taskArguments) => {
    const { tokenAddress, recipient, amount } = taskArguments

    const IERC20 = artifacts.require("IERC20")
    const token = await IERC20.at(tokenAddress)

    return await token.transfer(recipient, amount)
  })

task('setOwner', 'Sets the owner of the vesting contract')
  .addParam('vestingAddress', 'Vesting contract address')
  .addParam('newOwner', 'New owner address')
  .setAction(async (taskArguments) => {
    const { vestingAddress, newOwner } = taskArguments

    const TokenVesting = artifacts.require("TokenVesting")
    const vesting = await TokenVesting.at(vestingAddress)

    return await vesting.transferOwnership(newOwner)
  })

task('accounts', 'Prints a list of the available accounts', async () => {
  const accounts = await ethereum.send('eth_accounts')
  console.log('Accounts:', accounts)
})

module.exports = {}


// Helpers
function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
    +match === 0 ? '' : index == 0 ? match.toLowerCase() : match.toUpperCase()
  )
}
