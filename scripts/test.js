// We require the Buidler Runtime Environment explicitly here. This is optional.
const env = require("@nomiclabs/buidler");

async function main() {
  const accounts = await env.ethereum.send('eth_accounts')

  const token = await env.run('deploy_token', { amount: 1})
  const transfer = await env.run('transfer_token', {
    token_address: token.address,
    recipient: accounts[1],
    amount: 1
  })

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
