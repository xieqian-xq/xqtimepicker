#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下
cd dist

git init
git add -A
git commit -m 'deploy'

# 部署到 https://xieqian-xq.github.io/xqtimepicker
git push -f git@github.com:xieqian-xq/xqtimepicker.git master:gh-pages

cd -

echo "按任意键继续"
read -n 1
