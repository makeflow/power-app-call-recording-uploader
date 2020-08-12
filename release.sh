#!/usr/bin/env sh

set -e
set -o pipefail

trap "echo 'error occurred, please check.'" ERR

TYPE="$1"
VER="$2"

if [ -z $TYPE ]; then
  echo "please enter release type (android/power-app)"
  exit 1
fi

if [ -z $VER ]; then
  echo "please enter version number"
  exit 1
fi

case $TYPE in
android)
  TAG="android-release-v$VER"
  cd android-app
  ;;

power-app)
  TAG="power-app-v$VER"
  cd power-app
  ;;

*)
  echo "unknown type: '$TYPE'"
  exit 1
  ;;
esac

npm --no-git-tag-version --allow-same-version version "$VER"
cd -

git add .
git commit -m "$TAG"
git tag $TAG
git push
git push origin $TAG
