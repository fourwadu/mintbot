import { PopulatedTransaction } from "ethers";
import Queue from "./queue";
import abi from "../../data/abi.json";
export const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

export const GOERLI_FLASHBOTS_ENDPOINT = "https://relay-goerli.flashbots.net/";

export const TransactionQueue = new Queue<PopulatedTransaction>();

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
		name: "maxFee",
		type: "number",
		default: 100,
		message: "Enter the max fee of your transaction:",
	},
	{
		name: "priorityFee",
		type: "number",
		default: 50,
		message: "Enter the priority fee of your transaction:",
	},
	{
		name: "quantity",
		type: "number",
		default: 1,
		message: "Enter the number of transactions you would like to send:",
	},
];
