import { WALLET_ADDRESS } from "./../utils/env";
import { web3 } from "./index";
import { TransactionQueue, toGwei } from "./../utils/etc";
const abi = require("../../abi.json");

export default class Transaction {
	contractAddress: string;
	method: string;

	constructor(contractAddress: string, method: string) {
		Object.assign(this, { contractAddress, method });
	}

	private async createTransaction(...args: any[]): Promise<any> {
		const contract = new web3.eth.Contract(abi, this.contractAddress, {
			from: "0x7754093c513dc266fe28Bc4381A46D2E0AE30435",
		});
		const method = await contract.methods[this.method](...args);

		const gasLimit =
			(await method.estimateGas({
				to: "0x7754093c513dc266fe28Bc4381A46D2E0AE30435",
			})) * 1.2;

		const data = await method.encodeABI();

		const tx = {
			from: WALLET_ADDRESS,
			to: this.contractAddress,
			gasLimit: Math.ceil(gasLimit),
			value: 0,
			maxFeePerGas: toGwei(300),
			maxPriorityFeePerGas: toGwei(300),
			chainId: 1,
			type: 2,
			data,
		};
		return tx;
	}

	public async queueBundle(...args: any[]) {
		const transaction = await this.createTransaction(...args);
		TransactionQueue.enqueue(transaction);
	}
}
