import * as vscode from 'vscode';

import * as parser from "./parser";

const headerDecorationDefaults = {
	rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
	fontWeight: "600"

} as vscode.DecorationRenderOptions;

const sectionDecorationDefaults = {
	overviewRulerLane: vscode.OverviewRulerLane.Center
} as vscode.DecorationRenderOptions;

const palette = [
	"#e62720",
	"#e06914",
	"#f7f13b",
	"#4fe048",
	"#28edb5",
	"#847af0",
	"#c227f5",
	"#f263a8"
] as string[];


export type SectionDecorator = {
	headerDecoration: vscode.TextEditorDecorationType,
	sectionDecoration?: vscode.TextEditorDecorationType
}

let sectionDecoratorsCache = [] as SectionDecorator[];
export function getSectionDecorator(sectionIndex: number): SectionDecorator {
	let cached = sectionDecoratorsCache[sectionIndex];
	if (cached) {
		return cached;
	} else {
		let headerDecoration: vscode.TextEditorDecorationType;
		let sectionDecoration: vscode.TextEditorDecorationType | undefined;

		if (sectionIndex > 0) {
			let sectionColor = palette[(sectionIndex - 1) % palette.length];
			headerDecoration = vscode.window.createTextEditorDecorationType({
				...headerDecorationDefaults, color: sectionColor
			})
			sectionDecoration = vscode.window.createTextEditorDecorationType({
				...sectionDecorationDefaults, overviewRulerColor: sectionColor + "80"
			});
		} 
		else {
			headerDecoration = vscode.window.createTextEditorDecorationType({
				...headerDecorationDefaults, color: "#ffffff"
			})
		}

		let decorator = {headerDecoration, sectionDecoration} as SectionDecorator;
		sectionDecoratorsCache[sectionIndex] = decorator;
		return decorator;
	}
}

export function applyDecorators(editor: vscode.TextEditor, sections: parser.DocumentSection[]) {
	let toSet = Math.max(sectionDecoratorsCache.length, sections.length);
	for (let i = 0; i < toSet; i++) {
		let decorator = getSectionDecorator(i);
		if (i < sections.length) {
			let section = sections[i];
			editor.setDecorations(decorator.headerDecoration, section.headerRanges);
			if (decorator.sectionDecoration) {
				editor.setDecorations(decorator.sectionDecoration, [new vscode.Range(
					section.startLine, 0, section.endLine, 1
				)]);
			}
		} 
		else {
			editor.setDecorations(decorator.headerDecoration, []);
			if (decorator.sectionDecoration) editor.setDecorations(decorator.sectionDecoration, []);
		}
	}
}