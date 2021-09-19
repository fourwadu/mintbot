import { isEmptyObject } from "./utils/etc";
import { PopulatedTransaction } from "ethers";
import { AnswerType } from "./utils/types";
import { INPUTS } from "./utils/constants";
import Transaction from "./bot/transaction";
import inquirer from "inquirer";
import submitBundle from "./bot";
import config from "../data/config.json";

(async () => {
	if (config && !isEmptyObject(config)) {
		const confirmation = await inquirer.prompt([
			{ name: "confirm", type: "confirm", default: false },
		]);
		if (!confirmation.confirm) {
			return;
		}
		console.log("Continuing with config\n", config);
	}

	const answers = isEmptyObject(config)
		? await inquirer.prompt(INPUTS)
		: config;

	const T = new Transaction(answers.address, answers.method);

	try {
		[...Array(answers.quantity)].forEach(async () => {
			const transaction = await T.createTransaction(answers.value, answers.arg);
		});
	} catch (err) {
		console.error(err);
	}

	submitBundle();
})();
