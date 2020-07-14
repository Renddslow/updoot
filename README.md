# verify-changelog

> A githook designed to check if your changelog is updated when a package version is updated.

## Install

```
$ yarn add verify-changelog
```

## Usage

```
  Description
    Verify that updates to the pkg.version in a commit are accompanied by a changelog entry.

  Usage
    $ verify-changelog [options]

  Options
    -i, --ignore-level    Ignore a version level (major | minor | patch | pre-release)
    -w, --workspace       When set verify-changelog will look for a yarn workspace setup  (default false)
    --warn-only           When verify-changelog finds a missing changelog entry, it will only warn and exit
    -v, --version         Displays current version
    -h, --help            Displays this message
```

If verify-changelog finds missing changelog entries, it will prompt for changelog entries to be added. Changes will be automatically staged following the prompt so they can be included in the commit.

## Options

### `-i, --ignore-level`

Type: `major | minor | patch | pre-release`

Ignore a version level (major | minor | patch | pre-release). By default, verify-changelog will require any `pkg.version` change to have an associated changelog entry. If your shop doesn't require changelog entries for certain version levels (for instance, if you publish a bunch of test/release candidates before doing "real" releases), you can use this option to prevent checks on those.

Similar to caret ranges, `--ignore-level` will ignore the level and down. So if `minor` is specified, `patch` and `pre-release` will be as well.

Example:

```json
{
  "version": "1.2.0" // previously 1.1.0
}
```

```
$ verify-changelog -i minor
```

In the above case, a changelog entry would not be enforced for this change. Similarly going from `1.1.1` -> `1.1.2` would also be ignored.

### `-w, --workspace`

Type: `boolean`

Default: `false`

When set verify-changelog will look for a yarn workspace setup. This is recommended if you are running a monorepo.

verify-changelog will only look in `<your-workspace-dir>/**` for a CHANGELOG in these cases, as it assumes you are working with published packages.

### `--warn-only`

When verify-changelog finds a missing changelog entry, it will only warn and exit. This is useful if you want to run this check in a CI environment (though it is recommended that you still supply this as a githook, using the CI check as a confirmation). Warning will not prompt for Changelog entries.
