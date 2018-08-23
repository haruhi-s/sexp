# Sexp
sexp support for vscode. Inspired by Emacs.

## How to use
Press `Alt+I` and `Alt+U` to control the anchor of the selection by s-expressions. `Alt+I` moves it forward and `Alt+U` retracts it. `Alt+J/k` controls the active cursor (the other end of the selection) in the same way, and it also works when you are not trying to select things. When navigating, use `Alt + J/K` to move between sexp's, and when trying to select, use all four to precisely control your selection. 

## Building
Run git clone for this repo.
Run npm install vscode under this repo.
Run `code .` and press `F5` to debug in a new instance of VSCode. Make changes and `F5` to see changes.

## TODO
- It needs to parse RegExp's correctly.

### Commands
|Command | Status | Desc |
|--------|--------|------|
| `M-K` | OK | Move forward by one s-exp |
| `M-J` | OK | Move backward by one s-exp |
| `M-I` | OK | Slurp one s-exp forward |
| `M-U` | OK | Barf one s-exp to the front |