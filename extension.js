const vscode = require('vscode');
const ytpl = require('ytpl');
const NodeCache = require("node-cache");
const Cache = new NodeCache({ stdTTL: 3600 });
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('djmax.playlist', async function () {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Loading DJmax playlist...",
			cancellable: false
		}, async () => {
			let playlist = Cache.get("playlist");
			if (playlist == undefined) {
				playlist = await ytpl('UCyWiQldYO_-yeLJC0j5oq2g', { limit: Infinity });
				Cache.set("playlist", playlist);
			}
			let items = [];
			for (let index = 0; index < playlist.items.length; index++) {
				let item = playlist.items[index];
				items.push({
					label: item.title,
					description: item.duration,
					detail: item.url
				});
			}
			vscode.window.showQuickPick(items).then(selection => {
				if (!selection) {
					return;
				}
				vscode.env.openExternal(vscode.Uri.parse(selection.detail));
			});
		});


	});
	context.subscriptions.push(disposable);
}

function deactivate() {
	Cache.flushAll()
}

module.exports = {
	activate,
	deactivate
}
