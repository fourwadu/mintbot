import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { INFURA_KEY, WALLET_PRIVATE_KEY } from "./../utils/env";
import Web3 from "web3";
import { CHAIN_ID } from "../utils/env";
import { FLASHBOTS_ENDPOINT, TransactionQueue } from "./../utils/constants";
import { Tx } from "./../utils/types";

export const provider = new providers.InfuraProvider(CHAIN_ID);
export const wallet = new Wallet(WALLET_PRIVATE_KEY, provider);
export const web3 = new Web3(
	new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_KEY}`)
);

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

		TransactionQueue.peekTo(3)?.forEach(async (transaction) => {
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
