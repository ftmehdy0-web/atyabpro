#!/bin/sh
# Build the site and publish dist/ to the gh-pages branch (served by GitHub Pages).
set -e
cd "$(dirname "$0")/.."
npm run build -- --base=/atyabpro/
cp dist/index.html dist/404.html   # deep links like /shop/oils load the app
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Deploy $(git -C .. rev-parse --short HEAD)"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
