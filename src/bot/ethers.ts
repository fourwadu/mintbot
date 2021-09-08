import Web3 from "web3";
import { CHAIN_ID } from "./../utils/env";
import { providers, Contract } from "ethers";
import { WALLET_PRIVATE_KEY } from "../utils/env";
import { Wallet, PopulatedTransaction } from "ethers";
import abi from "../../abi.json";

export const provider = new providers.InfuraProvider(CHAIN_ID);
export const wallet = new Wallet(WALLET_PRIVATE_KEY, provider);

export async function createTx(
	contractAddress: string,
	method: string,
	...args: any[]
): Promise<PopulatedTransaction> {
	const contract = new Contract(contractAddress, abi);
	const tx = await contract.populateTransaction[method](...args);

	return tx;
}
