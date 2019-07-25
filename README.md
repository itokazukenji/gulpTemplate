# gulpTemplate

## Usage

### ejsとsassを使用したgulp環境設定

```bash
node.jsの最新版をダウンロード (2019年7月25日　現在v12.6.0で動作可能)

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

ターミナルから
npx gulp
実行で作業開始

ブラウザは開くがindex.htmlがないためエラーが表示される
フォルダ構成通りに作業フォルダ直下にsrcフォルダ、srcフォルダ直下にindex.ejsを作成し、保存

distフォルダが作成され、index.htmlも吐き出されたことを確認し、ブラウザをリロード

index.htmlが問題なく表示されたら作業開始

作業終了、設定変更などあればターミナルから
control + c
でwatch状態から抜ける

あとは
npx gulp
と
control + c
での作業となる

※htmlファイルはejs、cssファイルはscssで作成すること

```
