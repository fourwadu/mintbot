import { simulateBundle } from "./../utils/etc";
import { Wallet } from "ethers";
import {
	FlashbotsBundleProvider,
	FlashbotsBundleResolution,
	FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";

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
		const txBundle: FlashbotsBundleTransaction[] = [];

		console.log("Found block", blockNumber);
		if (!blockDetails.baseFeePerGas) {
			return;
		}

		const currentQueue = TransactionQueue.peekTo(2);
		if (currentQueue?.length === 0) {
			return;
		}

		currentQueue.forEach(async (transaction) => {
			txBundle.push({ transaction, signer: wallet });
		});

		try {
			var gasUsed = await simulateBundle(flashbotsProvider, txBundle);
		} catch (err) {
			console.log(err);
			return;
		}

		console.log(gasUsed);

		const bundleResponse = await flashbotsProvider.sendBundle(
			txBundle,
			blockNumber + 1
		);

		if ("error" in bundleResponse) {
			throw new Error(bundleResponse.error.message);
		}
		const bundleResolution = await bundleResponse.wait();

		if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
			console.log(`Submitted bundle in block ${blockNumber + 1}`);
			Array.from({ length: 2 }, TransactionQueue.dequeue);
		} else if (
			bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion
		) {
			console.log(`Not included in ${blockNumber}`);
		}
	});
}
