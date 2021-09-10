import { randomNumber } from "./utils/etc";
import { BigNumber } from "ethers";
import web3 from "web3";
import { createTx } from "./bot/web3";
import { bundleTransaction } from "./bot/transaction";

const submitTx = async () => {
	const tx = await createTx(
		"0xecdd2f733bd20e56865750ebce33f17da0bee461",
		"mint",
		5
	);

	bundleTransaction(tx, {
		gwei: 2000,
		priorityFee: 200,
		gasLimit: 300000,
		value: 0.35,
	});
};

(async () => {
	[...Array(1).keys()].forEach(() => {
		submitTx();
	});
})();
