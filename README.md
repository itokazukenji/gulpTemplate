# gulpTemplate

## Usage


```bash
node.jsの最新版をダウンロード

ターミナルからnode及びnpmがインストールされているか確認
node -v
バージョン情報が出ればOK
npm -v
同じくバージョンを確認

gulpTemplateをダウンロード （git cloneでも）
フォルダ名を作業フォルダ名に変更し任意の場所へ

ターミナルで作業用フォルダ内に入る
デスクトップであれば
cd /Users/○○○/Desktop/作業フォルダ名 (違う場合ある)
をターミナルで実行

以下は全て作業フォルダ内

package.jsonに記述されている諸々をダウンロードする為
ターミナルから
npm install -D
を実行

gulpfile.jsに書き込まれているフォルダ構成、コメントなどを確認
フォルダ構成を確認

作業フォルダ直下にsrcフォルダとsrcフォルダ直下にindex.ejsを作成
(後で作成してもいいが混乱しないようにここで作成しておく)

ターミナルから
npx gulp
実行で作業開始

作業終了、設定変更などあればターミナルから
control + c
でwatch状態から抜ける

あとは
npx gulp
と
control + c
での作業となる

```
