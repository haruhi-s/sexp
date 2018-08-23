'use strict';
import * as vscode from 'vscode';

var inMarkMode: boolean = false;
export function activate(context: vscode.ExtensionContext) {


    console.log('Congratulations, your extension "sexp" is now active!');
    function nextSexpEnd(s: string) {
        let atom_ = '\'"[](){} \t\n\r.,<>-+*/=!@#$%^&|\\~;';
        let symbol = '.,<>-+*/=!@#$%^&|\\~;';
        let spaces = ' \r\n\t';
        let pos = 0;
        function skip(that: string, toInclude: boolean) {
            while (pos < s.length && toInclude === that.includes(s[pos])) {
                pos++;
            }
        }
        function skipQ(Q: string) {
            pos++;
            while (pos < s.length && s[pos] !== Q) {
                if (s[pos] === '\\') {
                    pos += 2;
                } else {
                    pos++;
                }
            }
            pos++;
        }
        function skipSexp() {
            skip(spaces, true);
            if ('"\''.includes(s[pos])) {
                skipQ(s[pos]);
            }
            else if (!atom_.includes(s[pos])) {
                skip(atom_, false);
            }
            else if (symbol.includes(s[pos])) {
                skip(symbol, true);
            }
            else if (s[pos] === '(') {
                skipParens(')');
            }
            else if (s[pos] === '[') {
                skipParens(']');
            }
            else if (s[pos] === '{') {
                skipParens('}');
            }
            return;
        }
        function skipParens(par: string) {
            pos++;
            while (s[pos] !== par) {
                if (pos >= s.length) {
                    return;
                }
                let oldPos = pos;
                skipSexp();
                if (oldPos === pos) {
                    break;
                }
            }
            pos++;
            return;
        }
        skipSexp();
        return pos;
    }
    function selectionChanger(func: (editor: vscode.TextEditor, doc: vscode.TextDocument) => any) {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let doc = editor.document;
        func(editor, doc);
    }
    function getCurrentOffset(editor: vscode.TextEditor, doc: vscode.TextDocument) {
        return doc.offsetAt(editor.selection.active);
    }
    function reverse(s: string) {
        return s.split('').reverse().map((s) => {
            if (s === '(') {
                return ')';
            }
            else if (s === ')') {
                return '(';
            }
            else if (s === '{') {
                return '}';
            }
            else if (s === '}') {
                return '{';
            }
            else if (s === '[') {
                return ']';
            }
            else if (s === ']') {
                return '[';
            }
            else {
                return s;
            }
        }).join('');
    }
    function move(offset: number) {
        selectionChanger((editor, doc) => {
            let t = inMarkMode;
            let currentOffset = getCurrentOffset(editor, doc);
            let anchor = editor.selection.anchor;
            let newOffset = currentOffset + offset;
            let newActive = doc.positionAt(newOffset);
            editor.selection = new vscode.Selection(inMarkMode ? anchor : newActive, newActive);
            inMarkMode = t;
        });
    }
    function moveForwardSexp() {
        selectionChanger((editor, doc) => {
            let s = doc.getText().slice(getCurrentOffset(editor, doc));
            let n = nextSexpEnd(s);
            move(n);
        });
    }
    function slurpSexp() {
        inMarkMode = true;
        selectionChanger((editor, doc) => {
            let anchorOffset = doc.offsetAt(editor.selection.anchor);
            let s = doc.getText().slice(anchorOffset);
            let n = nextSexpEnd(s);
            anchorOffset += n;
            let newAnchor = doc.positionAt(anchorOffset);
            editor.selection = new vscode.Selection(newAnchor, editor.selection.active);
        });
    }
    function barfSexp() {
        selectionChanger((editor, doc) => {
            let anchorOffset = doc.offsetAt(editor.selection.anchor);
            let s = reverse(doc.getText().slice(0, anchorOffset));
            console.log(s);
            let n = nextSexpEnd(s);
            anchorOffset -= n;
            let newAnchor = doc.positionAt(anchorOffset);
            editor.selection = new vscode.Selection(newAnchor, editor.selection.active);
        });
    }
    function moveBackwardSexp() {
        selectionChanger((editor, doc) => {
            let s = reverse(doc.getText().slice(0, getCurrentOffset(editor, doc)));
            let n = nextSexpEnd(s);
            move(-n);
        });
    }

    let subs = context.subscriptions;
    vscode.window.onDidChangeTextEditorSelection((e) => {
        let editor = (vscode.window.activeTextEditor);
        if (!editor) {
            return;
        }
        let doc = editor.document;
        if (doc.offsetAt(editor.selection.active) === doc.offsetAt(editor.selection.anchor)) {
            inMarkMode = false;
        }
    });
    subs.push(vscode.commands.registerCommand('sexp.moveForward', () => moveForwardSexp()));
    subs.push(vscode.commands.registerCommand('sexp.moveBackward', () => moveBackwardSexp()));
    subs.push(vscode.commands.registerCommand('sexp.slurp', () => slurpSexp()));
    subs.push(vscode.commands.registerCommand('sexp.barf', () => barfSexp()));

}

// this method is called when your extension is deactivated
export function deactivate() {
}