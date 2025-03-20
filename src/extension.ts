import * as vscode from 'vscode';

import * as decorators from "./decorators";
import * as parser from "./parser";

function refresh() {
	let editor = vscode.window.activeTextEditor;
	let sections = parser.parseDocumentSections(editor.document);
	decorators.applyDecorators(editor, sections);
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		//vscode.commands.registerCommand('vscode-rainbow-comments.helloWorld', () => {
		//	vscode.window.showInformationMessage('Hello World from rainbow-comments!');
		//}),
		vscode.window.onDidChangeActiveTextEditor(refresh),
		vscode.workspace.onDidChangeTextDocument(refresh) // todo debounce?
	);
refresh();
}

export function deactivate() {}
