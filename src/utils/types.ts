import { BigNumber } from "@ethersproject/bignumber";
import { AccessList } from "@ethersproject/transactions";
import { Wallet } from "ethers";
// import { PopulatedTransaction } from "ethers";
export interface TxSettings {
	gasLimit?: number;
	value?: number;
	gwei?: number;
	priorityFee?: number;
}

export interface Tx {
	transaction: TransactionType;
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

export interface Settings {
	maxFee: number;
	priorityFee: number;
	value: number;
}

export interface TransactionType {
	to?: string;
	from?: string;
	nonce?: number;

	gasLimit?: BigNumber | number;
	gasPrice?: BigNumber;

	data?: string;
	value?: any;
	chainId?: number;

	type?: number;
	accessList?: AccessList;

	maxFeePerGas?: BigNumber;
	maxPriorityFeePerGas?: BigNumber;
}
