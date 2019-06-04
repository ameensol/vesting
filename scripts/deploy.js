async function main() {
  const Greeter = artifacts.require("Greeter");

  const greeter = await Greeter.new("Hello, Buidler!");
  console.log("Greeter deployed to:", greeter.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
