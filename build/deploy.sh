#! /bin/bash

set -e

branch=$(git branch --show-current)
version=$(npm --no-git-tag-version version $1 $2)
git commit -am "[package] $version"

if [ "$1" != "preminor" ] ; then
  git checkout master
  git merge $branch -m $version --no-ff
  git checkout develop
fi