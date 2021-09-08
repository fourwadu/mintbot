import { providers, Wallet, BigNumber, Contract } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import web3 from "web3";
const dotenv = require("dotenv");
dotenv.config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const wallet = new Wallet(
	"a9853f7e248167d9db0c8d1e0ed05b11fcbaa7816de337dc96ba91f88b8540bf",
	provider
);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_FEE = GWEI.mul(3);
console.log(PRIORITY_FEE);

async function main() {
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		wallet,
		`https://relay.flashbots.net`
	);

	provider.once("block", async (blockNumber) => {
		const block = await provider.getBlock(blockNumber);

		if (!block.baseFeePerGas) {
			return;
		}

		const contract = new Contract(
			"0x09151ae179692894c931276d546ca5a2f1907326",
			[
				{
					inputs: [
						{
							internalType: "uint256",
							name: "tokenId",
							type: "uint256",
						},
					],
					name: "claim",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
			]
		);

		var tx = await contract.populateTransaction.claim(web3.utils.toHex(4315));

		const maxBaseFeeInFutureBlock =
			FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
				block.baseFeePerGas,
				1
			);

		console.log(PRIORITY_FEE.add(maxBaseFeeInFutureBlock).toString());

		const toBundle = [
			{
				transaction: {
					chainId: 1,
					type: 2,
					value: 0,
					maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
					maxPriorityFeePerGas: web3.utils.toHex(
						web3.utils.toWei("20", "gwei")
					),
					gasLimit: 230000,
					...tx,
				},
				signer: wallet,
			},
		];

		console.log(blockNumber);
		const bundle = await flashbotsProvider.sendBundle(
			toBundle,
			blockNumber + 2
		);

		// // By exiting this function (via return) when the type is detected as a "RelayResponseError", TypeScript recognizes bundleSubmitResponse must be a success type object (FlashbotsTransactionResponse) after the if block.
		if ("error" in bundle) {
			console.warn(bundle.error.message);
			return;
		}

		console.log(await bundle.simulate());
		console.log(await bundle.wait());
	});
}

main();
