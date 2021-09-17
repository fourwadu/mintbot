import Transaction from "./bot/transaction";
import submitBundle from "./bot";
import inquirer from "inquirer";

(async () => {
	inquirer
		.prompt([
			{ name: "address", type: "input" },
			{ name: "method", type: "input" },
			{
				name: "arg",
				type: "number",
				default: undefined,
			},
			{
				name: "value",
				type: "number",
			},
			{
				name: "maxFee",
				type: "number",
				default: 100,
			},
			{
				name: "priorityFee",
				type: "number",
				default: 50,
			},
		])
		.then(async (answers) => {
			console.log(answers);
		});

	// const transaction = new Transaction(
	// 	"0x09151ae179692894c931276d546ca5a2f1907326",
	// 	"claim"
	// );

	// await transaction.queueBundle(3315);
	// await transaction.queueBundle(3314);
	// await transaction.queueBundle(3312);
	// submitBundle();
})();
