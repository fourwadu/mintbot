require("dotenv").config();

import { AssertionError } from "assert";

export const assert = <T>(value: T, errorMessage: string): NonNullable<T> => {
	if (value) return value as NonNullable<T>;
	throw new AssertionError({ message: errorMessage });
};

export const WALLET_PRIVATE_KEY = assert(
	process.env.WALLET_PRIVATE_KEY,
	"Please set your WALLET_PRIVATE_KEY in your environment file."
);

export const WALLET_ADDRESS = assert(
	process.env.WALLET_ADDRESS,
	"Please set your WALLET_ADDRESS in your environment file."
);

export const WEBHOOK_URL = assert(
	process.env.WEBHOOK_URL,
	"Please set your WEBHOOK_URL in your environment file."
);

export const INFURA_KEY = assert(
	process.env.INFURA_KEY,
	"Please set your INFURA_KEY in your environment file."
);

const NODE_ENV = assert(process.env.NODE_ENV, "No NODE_ENV found.");

export const CHAIN_ID = NODE_ENV.trim() == "production" ? 1 : 5;
