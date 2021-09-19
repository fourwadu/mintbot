import { PopulatedTransaction } from "ethers";
import { toGwei } from "./../utils/etc";
import { WALLET_ADDRESS } from "./../utils/env";
import { web3 } from "./index";
import { TransactionQueue } from "./../utils/constants";
import { BigNumber } from "@ethersproject/bignumber";
const abi = require("../../data/abi.json");

export default class Transaction {
	contractAddress: string;
	method: string;
	args: any[];

	constructor(contractAddress: string, method: string) {
		Object.assign(this, { contractAddress, method });
	}

	public async createTransaction(
		value: number,
		...args: any[]
	): Promise<PopulatedTransaction> {
		const contract = new web3.eth.Contract(abi, this.contractAddress, {
			from: WALLET_ADDRESS,
		});

		const method = await contract.methods[this.method](...args);

		const gasLimit =
			(await method.estimateGas({
				to: WALLET_ADDRESS,
			})) * 1.2;

		const data = await method.encodeABI();

		const tx = {
			from: WALLET_ADDRESS,
			to: this.contractAddress,
			gasLimit: BigNumber.from(Math.ceil(gasLimit)),
			value: toGwei(value),
			maxFeePerGas: toGwei(300),
			maxPriorityFeePerGas: toGwei(300),
			chainId: 1,
			type: 2,
			data,
		};

		TransactionQueue.enqueue(tx);

		return tx;
	}
}
