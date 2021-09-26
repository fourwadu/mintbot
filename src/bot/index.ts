import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";

import {
	FLASHBOTS_ENDPOINT,
	provider,
	TransactionQueue,
	wallet,
} from "./../utils/constants";
import { Tx } from "./../utils/types";

export default async function submitBundle(): Promise<void> {
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		Wallet.createRandom(),
		FLASHBOTS_ENDPOINT
	);

	provider.on("block", async (blockNumber: number) => {
		const blockDetails = await provider.getBlock(blockNumber);
		const txBundle: Tx[] = [];

		console.log("Found block", blockNumber);

		if (!blockDetails.baseFeePerGas) {
			return;
		}

		const currentQueue = TransactionQueue.peekTo(3);

		if (currentQueue?.length === 0) {
			return;
		}

		currentQueue.forEach(async (transaction) => {
			txBundle.push({ transaction, signer: wallet });
		});

		const bundle = await flashbotsProvider.sendBundle(
			txBundle,
			blockNumber + 1
		);

		if ("error" in bundle) {
			throw new Error("Error with bundle -\n" + JSON.stringify(bundle));
		}

		const simulation = await bundle.simulate();

		if ("error" in simulation) {
			console.log("Error with simulation -\n" + JSON.stringify(simulation));
			return;
		}

		const wait = await bundle.wait();

		if (wait) {
			console.log("Bundle not included in block. Trying again...");
			return;
		} else {
			console.log("Submitted.");
			Array.from({ length: 3 }, TransactionQueue.dequeue);
		}
	});
}
