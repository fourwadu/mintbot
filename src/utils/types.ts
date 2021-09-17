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
