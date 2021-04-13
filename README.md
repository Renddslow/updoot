# updoot

> A githook designed to remind you to update your changelog.

## Install

```
$ yarn add updoot
```

## Usage

This was designed to work in conjunction with husky and lint-staged. However, you can use it solo by passing a list of files to it.

```
  Description
    Checks to see if a Changelog is present in the list of changed files and alerts if one is not present.

  Usage
    $ updoot remind [options]

  Options
    -w, --workspace      Whether or not updoot should look for changelogs in yarn workspaces  (default false)
    --warn               Print to stdout without an exit(1) when changelogs are missing.  (default false)
    -i, --ignore-pkgs    When in a monorepo context, a comma-delimited list of packages to ignore
    --pattern            A case-insensitive wildcard pattern describing the filename of changelogs  (default changelog*)
    -h, --help           Displays this message
```

## Options

Since this is intended to be used with git and lint-staged, you may also provide an ENV argument to skip updoot when needed.

```
$ SKIP_UPDOOT=true git commit -m "Added a comma to a comment"
```
