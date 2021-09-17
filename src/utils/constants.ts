import { PopulatedTransaction } from "ethers";
import consola from "consola";
import Queue from "./queue";
export const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

export const GOERLI_FLASHBOTS_ENDPOINT = "https://relay-goerli.flashbots.net/";

export const TransactionQueue = new Queue<PopulatedTransaction>();
