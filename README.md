
---

# package

[![npm version](https://badgen.net/npm/v/package)](https://npm.im/package) [![npm downloads](https://badgen.net/npm/dm/@sidwebworks/get-packages)](https://npm.im/@sidwebworks/get-packages)

> Get packages from a monorepo (pnpm, yarn, npm, lerna)

## Install

```bash
npm i package
```

## Usage

```ts
import { getPackages } from "package"

const workspace = await getPackages(".")

// For a monorepo:
// workspace.type => 'monorepo'
// workspace.npmClient => 'pnpm' | 'yarn' | 'npm'
// workspace.root => { data, path }
// workspace.packages => [{ data, path }]

// For a non-monorepo:
// workspace.type => 'non-monorepo'
// workspace.npmClient => 'pnpm' | 'yarn' | 'npm'
// workspace.package => { data, path }
```

Type docs: https://paka.dev/npm/package


## License

MIT &copy; [sidwebworks](https://github.com/sponsors/sidwebworks)