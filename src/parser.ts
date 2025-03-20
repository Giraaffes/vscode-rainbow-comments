import * as vscode from 'vscode';

export type DocumentSection = {
	startLine: number,
	endLine: number,
	headerRanges: vscode.Range[]
};

function getLineContentRange(line: number, lineText: string): vscode.Range {
	if (lineText.trim() == "") {
		return new vscode.Range(line, 0, line, 0);
	} else {
		return new vscode.Range(
			line, lineText.match(/^\s*/)[0].length, 
			line, lineText.length - lineText.match(/\s*$/)[0].length
		);
	}
}

const sectionStartRegex = /^\s*\/\/\/\s+(\S.*?)\s*$/;
const sectionContinueRegex = /^\s*\/\/>\s+(\S.*?)\s*$/;
export function parseDocumentSections(document: vscode.TextDocument) {
	let sections = [] as DocumentSection[];
	let currentSection: DocumentSection;

	let text = document.getText();
	for (let [ line, lineText ] of text.split("\n").entries()) {
		if (lineText.match(sectionStartRegex)) {
			currentSection = {
				startLine: line,
				endLine: line,
				headerRanges: [getLineContentRange(line, lineText)]
			};
			sections.push(currentSection);
		} else if (currentSection && lineText.match(sectionContinueRegex)) {
			currentSection.headerRanges.push(getLineContentRange(line, lineText));
			currentSection.endLine = line;
		} else if (currentSection && lineText.trim() != "") {
			currentSection.endLine = line;
		}
	}

	return sections;
}