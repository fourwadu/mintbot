import { BigNumber } from "@ethersproject/bignumber";
import web3 from "web3";

export const toGwei = (number: number) => {
	return BigNumber.from(
		web3.utils.toHex(web3.utils.toWei(number.toString(), "gwei"))
	);
};

export const randomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isEmptyObject = (obj: Object) => {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
};
