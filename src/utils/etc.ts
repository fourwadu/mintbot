import { BigNumber } from "@ethersproject/bignumber";
import web3 from "web3";
import { ethers } from "ethers";
import { Tx } from "./types";
import {
	FlashbotsBundleProvider,
	FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";

export const toGwei = (number: number) => {
	return BigNumber.from(
		web3.utils.toHex(web3.utils.toWei(number.toString(), "gwei"))
	);
};

export const toEth = (number: number) => {
	return ethers.utils.parseUnits(number.toString(), "ether");
};

export const randomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isEmptyObject = (n: Object) => {
	return Object.keys(n).length === 0 && n.constructor === Object;
};

export const simulateBundle = async (
	provider: FlashbotsBundleProvider,
	tx: FlashbotsBundleTransaction[]
) => {
	const signedBundle = await provider.signBundle(tx);
	const simulation = await provider.simulate(signedBundle, "latest");

	console.log(simulation);
	if ("results" in simulation) {
		for (let i = 0; i < simulation.results.length; i++) {
			const txSimulation = simulation.results[i];
			if ("error" in txSimulation) {
				throw new Error(`${i} : ${txSimulation.error} ${txSimulation.revert}`);
			}
		}

		const gasUsed = simulation.results.reduce(
			(acc: number, txSimulation) => acc + txSimulation.gasUsed,
			0
		);

		return gasUsed;
	}

	// console.error(`Similuation failed: ${simulation.error.code}`);
	// console.error(simulation.error.message);
	throw new Error(simulation.error.message);
};
