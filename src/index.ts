import web3 from "web3";
import { createTx } from "./bot/web3";
import { bundleTransaction } from "./bot/transaction";

(async () => {
	const tx = await createTx(
		"0x09151ae179692894c931276d546ca5a2f1907326",
		"claim",
		web3.utils.toHex(4316)
	);

	bundleTransaction(tx);
})();
