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
  ;;
power-app)
  TAG="power-app-v$VER"
  ;;
*)
  echo "unknown type: '$TYPE'"
  exit 1
  ;;
esac

git tag $TAG
git push
git push origin $TAG
