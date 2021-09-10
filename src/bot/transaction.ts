import { toGwei } from "./../utils/etc";
import { TxSettings } from "./../utils/types";
import { PopulatedTransaction } from "ethers";
import web3 from "web3";
import {
	FLASHBOTS_ENDPOINT,
	GOERLI_FLASHBOTS_ENDPOINT,
} from "../utils/constants";
import { CHAIN_ID } from "../utils/env";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { provider, wallet } from "./web3";

export async function bundleTransaction(
	tx: PopulatedTransaction,
	settings: TxSettings
) {
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		wallet,
		CHAIN_ID == 1 ? FLASHBOTS_ENDPOINT : GOERLI_FLASHBOTS_ENDPOINT
	);

	provider.on("block", async (blockNumber: number): Promise<void> => {
		const blockDetails = await provider.getBlock(blockNumber);

		if (!blockDetails.baseFeePerGas) {
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
					gasLimit: settings.gasLimit || blockDetails.gasLimit,
					type: 2,
					value: web3.utils.toWei(settings.value?.toString() || "0", "ether"),
					maxFeePerGas: settings.gwei
						? toGwei(settings.gwei)
						: maxBaseFeeInFutureBlock,
					maxPriorityFeePerGas: toGwei(settings.priorityFee || 20),
					...tx,
				},
				signer: wallet,
			},
		];

		const bundle = await flashbotsProvider.sendBundle(baseTx, blockNumber + 1);
		console.log("Bundled");

		if ("error" in bundle) {
			console.log(bundle.error);
			return;
		}

		const simulation = await bundle.simulate();

		if ("error" in simulation || simulation.firstRevert) {
			console.log("Couldn't submit bundle.");
			provider.removeAllListeners();
			return;
		}

		const bundleResponse = await bundle.wait();

		console.log(`Bundle ${bundleResponse ? "not" : "was"} included in block`);

		if (!bundleResponse) {
			console.log("Minted successfully");
		}
	});
}
