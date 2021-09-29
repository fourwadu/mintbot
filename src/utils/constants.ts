import { WALLET_PRIVATE_KEY, CHAIN_ID } from "./env";
import { Wallet } from "ethers";
import { providers } from "ethers";
import { TransactionType } from "./types";

import abi from "../../data/abi.json";
import Queue from "./queue";
export const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

export const GOERLI_FLASHBOTS_ENDPOINT = "https://relay-goerli.flashbots.net/";

export const TransactionQueue = new Queue<TransactionType>();
export const provider = new providers.InfuraProvider(CHAIN_ID);
export const wallet = new Wallet(WALLET_PRIVATE_KEY, provider);

export const INPUTS = [
	{ name: "address", type: "input", message: "Enter the contract address:" },
	{
		name: "method",
		type: "list",
		choices: abi.map((method) => {
			return method.name;
		}),
		message: "Enter the contract method:",
	},
	{
		name: "arg",
		type: "input",
		default: undefined,
		message: "Enter the argument of the contract:",
	},
	{
		name: "value",
		type: "number",
		default: 0,
		message: "Enter the value of your transaction:",
	},
	{
		name: "gas",
		type: "number",
		default: 100,
		message: "Enter the gas fee of your transaction:",
	},
	{
		name: "quantity",
		type: "number",
		default: 1,
		message: "Enter the number of transactions you would like to send:",
	},
];
