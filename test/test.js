const { BN, shouldFail, time } = require('openzeppelin-test-helpers')
const assert = require("assert")

const TokenVesting = artifacts.require("TokenVesting")

contract("TokenVesting", function([_, owner, beneficiary]) {
  const amount = new BN('1000')

  beforeEach(async function () {
    // +1 minute so it starts after contract instantiation
    this.start = (await time.latest()).add(time.duration.minutes(1))
    this.cliffDuration = time.duration.years(1)
    this.duration = time.duration.years(2)
  })

  it('reverts with a duration shorter than the cliff', async function () {
    const cliffDuration = this.duration
    const duration = this.cliffDuration

    assert(cliffDuration >= duration)

    await shouldFail.reverting.withMessage(
      TokenVesting.new(beneficiary, this.start, cliffDuration, duration, true, { from: owner }),
      'TokenVesting: cliff is longer than duration'
    )
  })
})
