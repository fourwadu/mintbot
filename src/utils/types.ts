import { Wallet } from "ethers";
import { PopulatedTransaction } from "ethers";
export interface TxSettings {
	gasLimit?: number;
	value?: number;
	gwei?: number;
	priorityFee?: number;
}

export interface Tx {
	transaction: PopulatedTransaction;
	signer: Wallet;
}

export interface AnswerType {
	address: string;
	method: string;
	arg: string | undefined | number;
	value: number;
	maxFee: number;
	priorityFee: number;
	quantity: number;
}
