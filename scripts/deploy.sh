#!/bin/bash

DIR=$(dirname $(readlink -f $0))

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $HOME/.npmrc

# bash $DIR/package-version.sh @toi/toi packages/toi
bash $DIR/package-version.sh envaridator .
ENVARIDATOR_VERSION=$?

if [ "0" -eq "$ENVARIDATOR_VERSION" ]
then
#   cd packages/envaridator
  npm publish --access public
  EXCODE=$?
  cd ../..

  if [ "$EXCODE" != "0" ]
  then
    echo "Unable to publish Envaridator"
    exit $EXCODE
  fi
else
  echo "Package envaridator is already published."
fi