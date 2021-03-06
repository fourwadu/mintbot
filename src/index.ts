import { isEmptyObject } from "./utils/etc";
import { AnswerType } from "./utils/types";
import { INPUTS } from "./utils/constants";
import Transaction from "./bot/transaction";
import inquirer from "inquirer";
import submitBundle from "./bot";
import config from "../data/config.json";

(async () => {
	if (config && !isEmptyObject(config)) {
		console.log("Continuing with config\n", config);

		const confirmation = await inquirer.prompt([
			{ name: "confirm", type: "confirm", default: false },
		]);
		if (!confirmation.confirm) {
			return;
		}
	}

	const answers = config;

	const T = new Transaction(answers.address, answers.method);

	try {
		[...Array(answers.quantity)].forEach(async () => {
			await T.createTransaction(
				{
					value: answers.value,
					gas: answers.gas,
				},
				answers.arg
			);
		});
	} catch (err) {
		console.error(err);
	}

	submitBundle();
})();
