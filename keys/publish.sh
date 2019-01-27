#!/bin/sh

version=$1

cd blackjack

file="web-ext-artifacts/blackjack-$version-an+fx.xpi"
sha=$(sha256sum $file | cut -d' ' -f1)

echo "{"
echo "\"version\": \"$version\", "
echo "\"update_link\": \"https://joern314.github.io/Blackjack/blackjack/$file\", "
echo "\"update_hash\": \"sha256:$sha\" "
echo "}"

