#! /bin/bash

set -e

version=$(npm --no-git-tag-version version patch)
git commit -am "[package] $version"
current=$(git branch --show-current)
git checkout master
git merge $current -m $version --no-ff
git checkout develop