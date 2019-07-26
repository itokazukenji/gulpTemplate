## gulpTemplate

### ejsとsassを使用したgulp環境設定

#### 機能

```bash
ejsからhtmlにコンパイル
scssファイルにsassを記述してcssにコンパイル
cssの記述ミスのチェック
es6以降のjavascriptをコンパイル
javascriptの記述ミスのチェック
画像の圧縮
メディアクエリまとめ
ベンダープレフィックス自動付加
ブラウザと同期しながらの編集

```

#### 導入マニュアル 

```bash
node.jsの最新版をダウンロード (2019年7月25日　現在v12.6.0で動作可能)

ターミナルからnode及びnpmがインストールされているか確認
node -v
バージョン情報が出ればOK
npm -v
同じくバージョンを確認

gulpTemplateをダウンロード （git cloneでも可）
フォルダ名を作業フォルダ名に変更し任意の場所へ

ターミナルで作業用フォルダ内に入る
(デスクトップであれば
cd /Users/○○○/Desktop/作業フォルダ名
をターミナルで実行)

以下は全て作業フォルダ内

package.jsonに記述されている諸々をダウンロードする為
ターミナルから
npm install -D
を実行

gulpfile.jsをエディターで開き書き込まれているフォルダ構成、コメントなどを確認
src、assetsなど必要なフォルダとファイルの作成
最低限srcフォルダとその直下にindex.ejsファイルを作成、browser-syncを機能させるため、必ずbodyタグは記述する
(npx gulpを実行した時にindexのbodyタグを見に行くため)

まずは準備した環境をbuild
ターミナルから
npx gulp build
を実行
distフォルダが作成され、準備したファイルが生成されているかを確認

ターミナルから
npx gulp
実行でwatchしながらの作業開始

作業終了、設定変更などあればターミナルから
control + c
を実行でwatch状態から抜ける

あとは
npx gulp
と
control + c
での作業

※htmlファイルはejs、cssファイルはscssで作成すること
※コンポーネントとしてincludeするファイルはファイル名を_hoge.ejsとファイル名の最初に'_'をつけること
(変数宣言などでエラーを表示させないため)
※gulpfile.jsの設定を変更した場合はnpx gulpの前にnpx gulp buildを一度実行してからの方がベター
※作成したファイルがdistに反映されない場合などは一度control + cでwatchを抜け、npx gulp build、npx gulpと実行してみる

```
