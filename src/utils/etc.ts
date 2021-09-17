import web3 from "web3";

export const toGwei = (number: number) => {
	return web3.utils.toHex(web3.utils.toWei(number.toString(), "gwei"));
};

export const randomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
