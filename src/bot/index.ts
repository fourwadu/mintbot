import { FLASHBOTS_ENDPOINT } from "./../utils/constants";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { INFURA_KEY, WALLET_PRIVATE_KEY } from "./../utils/env";
import Web3 from "web3";
import { TransactionQueue } from "./../utils/etc";
import { CHAIN_ID } from "../utils/env";
import { providers, Wallet } from "ethers";

export const provider = new providers.InfuraProvider(CHAIN_ID);
export const wallet = new Wallet(WALLET_PRIVATE_KEY, provider);
export const web3 = new Web3(
	new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_KEY}`)
);

export default async function submitBundle() {
	console.log("Initiated.");
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		Wallet.createRandom(),
		FLASHBOTS_ENDPOINT
	);
	provider.on("block", async (blockNumber: number) => {
		const blockDetails = await provider.getBlock(blockNumber);
		const txBundle: any[] = [];

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
			return;
		}

		const simulation = await bundle.simulate();

		console.log(simulation);
	});
}
