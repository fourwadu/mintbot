import { PopulatedTransaction, ethers, providers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

import { sleep, toGwei, toEth } from "./../utils/etc";
import { CHAIN_ID, WALLET_ADDRESS } from "./../utils/env";
import { TransactionQueue, provider } from "./../utils/constants";
const abi = require("../../data/abi.json");

export default class Transaction {
	contractAddress: string;
	method: string;
	args: any[];

	constructor(contractAddress: string, method: string) {
		Object.assign(this, { contractAddress, method });
	}

	public async createTransaction(
		settings: { value: number; gas: number },
		...args: any[]
	): Promise<PopulatedTransaction> {
		const contract = new ethers.Contract(this.contractAddress, abi, provider);
		const populated = await contract.populateTransaction[this.method](...args);

		try {
			const gasLimit = (
				await provider.estimateGas({
					...populated,
					value: toEth(settings.value),
					to: this.contractAddress,
					from: WALLET_ADDRESS,
				})
			).add(BigNumber.from(10000));

			const tx: PopulatedTransaction = {
				from: WALLET_ADDRESS,
				value: toEth(settings.value),
				maxPriorityFeePerGas: toGwei(settings.gas),
				maxFeePerGas: toGwei(settings.gas),
				chainId: 1,
				type: 2,
				gasLimit,
				...populated,
			};

			TransactionQueue.enqueue(tx);
			return tx;
		} catch (err: any) {
			console.log(err.error.message || err);
			await sleep(1500);
			return this.createTransaction(settings, ...args);
		}
	}
}
