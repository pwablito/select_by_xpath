/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';


function xpath_to_css_selector(xpath: string) {
	//TODO implement conversion/parsing
	let split = xpath.trim().split('/').filter((value: string) => value !== '');
	var new_xpath = "";
	for (let i = 0; i < split.length; i++) {
		new_xpath += split[i];
		if (i !== split.length - 1) {
			new_xpath += " > ";
		}
	}
	return new_xpath.split('[').join(':nth-of-type(').split(']').join(')');
}

function css_selector_to_js_selector(css_selector: string) {
	return `document.querySelector("${css_selector}")`;
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('select-by-xpath.convert_xpath', async () => {
		let xpath: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Example: /html/body/button',
			prompt: 'Input an XPath',
		});
		if (!xpath) {
			vscode.window.showInformationMessage('Empty input XPath');
			return;
		}
		let js_selector = css_selector_to_js_selector(xpath_to_css_selector(xpath));
		await vscode.window.showInputBox({
			ignoreFocusOut: true,
			value: js_selector,
			prompt: 'Raw JS Selector',
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('select-by-xpath.convert_clipboard_xpath', async () => {
		let xpath: string = await vscode.env.clipboard.readText();
		if (!xpath) {
			vscode.window.showInformationMessage('Empty input XPath');
			return;
		}
		let js_selector = css_selector_to_js_selector(xpath_to_css_selector(xpath));
		await vscode.env.clipboard.writeText(js_selector);
		vscode.window.showInformationMessage('Clipboard XPATH converted to JS selector');
	}));
}

export function deactivate() {}
