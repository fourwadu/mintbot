import { BigNumber } from "@ethersproject/bignumber";
import { AccessList } from "@ethersproject/transactions";
import { Wallet } from "ethers";

export interface Tx {
	transaction: TransactionType;
	signer: Wallet;
}

export interface AnswerType {
	address: string;
	method: string;
	arg: string | undefined | number;
	value: number;
	gas: number;
	quantity: number;
}

export interface Settings {
	gas: number;
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
