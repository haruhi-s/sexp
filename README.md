# Sexp
sexp support for vscode. Inspired by Emacs.

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
| `M-;` | OK | Slurp one s-exp forward |
| `M-L` | OK | Barf one s-exp to the front |