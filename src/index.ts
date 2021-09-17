import { BigNumber } from "ethers";
import { toGwei } from "./utils/etc";
import Transaction from "./bot/transaction";
import submitBundle from "./bot";

(async () => {
	const transaction = new Transaction(
		"0x09151ae179692894c931276d546ca5a2f1907326",
		"claim"
	);

	await transaction.queueBundle(3312);
	submitBundle();
})();
