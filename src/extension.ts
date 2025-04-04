import * as vscode from 'vscode';

import * as decorators from "./decorators";
import * as parser from "./parser";

const languages = ["javascript", "typescript", "c"];

function refresh() {
	let editor = vscode.window.activeTextEditor;
	
	if (languages.includes(editor.document.languageId)) {
		let sections = parser.parseDocumentSections(editor.document);
		decorators.applyDecorators(editor, sections);
	} 
	else {
		decorators.clearDecorators(editor);
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(refresh),
		vscode.workspace.onDidChangeTextDocument(refresh)
	);
	refresh();
}

export function deactivate() {}
