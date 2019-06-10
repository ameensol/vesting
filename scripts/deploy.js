async function main() {
  const TokenVesting = artifacts.require("TokenVesting")
  const tokenvesting = await TokenVesting.new()
  console.log(`TokenVesting is live at: ${tokenvesting.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
