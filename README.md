# Sexp
sexp support for vscode. Inspired by Emacs.

## Building
Run git clone for this repo.
Run npm install vscode under this repo.
Run `code .` and press `F5` to debug in a new instance of VSCode. Make changes and `F5` to see changes.

## TODO
- It needs to parse RegExp's correctly.

### Move command
|Command | Status | Desc |
|--------|--------|------|
| `M-L` | OK | Move forward by one s-exp |
| `M-J` | OK | Move backward by one s-exp |

### Other Command
|Command | Status | Desc |
|--------|--------|------|
| `M-K` | OK | Slurp one s-exp forward |