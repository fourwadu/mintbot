import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
const dotenv = require("dotenv");
dotenv.config();

const CHAIN_ID = 5;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay-goerli.flashbots.net";

if (process.env.WALLET_PRIVATE_KEY === undefined) {
	console.error("Please provide WALLET_PRIVATE_KEY env");
	process.exit(1);
}

const wallet = new Wallet(
	"a9853f7e248167d9db0c8d1e0ed05b11fcbaa7816de337dc96ba91f88b8540bf",
	provider
);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const gwei = 10n ** 9n;
const ETHER = 10n ** 18n;

async function main() {
	console.log((await wallet.getBalance()).toString());

	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		wallet,
		`https://relay.flashbots.net`
	);

	provider.on("block", async (blockNumber) => {
		const bundle = await flashbotsProvider.sendBundle(
			[
				{
					transaction: {
						chainId: CHAIN_ID,
						type: 2,
						value: 0,
						data: "0x379607f50000000000000000000000000000000000000000000000000000000000000021",
						maxFeePerGas: gwei * 3n,
						maxPriorityFeePerGas: gwei * 2n,
						// maxFeePerGas: 600n,
						// maxPriorityFeePerGas: 1n,
						to: "0x09151ae179692894c931276d546ca5a2f1907326",
						gasLimit: 230000,
					},
					signer: wallet,
				},
			],
			blockNumber + 1
		);

		// By exiting this function (via return) when the type is detected as a "RelayResponseError", TypeScript recognizes bundleSubmitResponse must be a success type object (FlashbotsTransactionResponse) after the if block.
		if ("error" in bundle) {
			console.warn(bundle.error.message);
			return;
		}

		console.log(await bundle.simulate());
	});
}

main();
