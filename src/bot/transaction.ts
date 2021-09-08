import web3 from "web3";
import {
	FLASHBOTS_ENDPOINT,
	GOERLI_FLASHBOTS_ENDPOINT,
} from "../utils/constants";
import { CHAIN_ID } from "../utils/env";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { provider, wallet } from "./ethers";

export async function bundleTransaction(tx: any) {
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		wallet,
		CHAIN_ID == 1 ? FLASHBOTS_ENDPOINT : GOERLI_FLASHBOTS_ENDPOINT
	);

	provider.on("block", async (blockNumber): Promise<void> => {
		const blockDetails = await provider.getBlock(blockNumber);

		if (!blockDetails.baseFeePerGas) {
			console.log("Found a legacy block. Waiting for next block...");
			return;
		}

		const maxBaseFeeInFutureBlock =
			FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
				blockDetails.baseFeePerGas,
				1
			);

		const baseTx = [
			{
				transaction: {
					chainId: CHAIN_ID,
					gasLimit: 230000,
					type: 2,
					value: 0,
					maxFeePerGas: maxBaseFeeInFutureBlock,
					maxPriorityFeePerGas: web3.utils.toHex(
						web3.utils.toWei("20", "gwei")
					),
					...tx,
				},
				signer: wallet,
			},
		];

		const bundle = await flashbotsProvider.sendBundle(baseTx, blockNumber + 1);

		if ("error" in bundle) {
			console.log(bundle.error);
			return;
		}

		const simulation = await bundle.simulate();

		if ("error" in simulation) {
			console.log("Couldn't submit bundle.");
			console.log(simulation.error);
			return;
		}

		console.log(
			`Submitted bundle with hash ${simulation.results[0].txHash}... Waiting...`
		);

		const bundleResponse = (await bundle.wait()) == 1 ?? true;

		console.log(
			`Bundle ${bundleResponse ? "" : "not "}included in block ${
				blockNumber + 1
			}`
		);
	});
}
