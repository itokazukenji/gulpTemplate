'use strict'

// config.jsonは必ず作成する。 必要ない場合、ディレクトリを変更する場合は必ず関連箇所も編集
// 読み取るファイル、書き出すファイルのパス設定
//
// 作業ディレクトリ
//       ├────────dist (自動で生成され、全てのファイルはこのディレクトリ以下に吐き出される。基本中身はいじらない)
//       └────────src
//                 ├──index.ejs
//                 └──assets
//                     ├──scss (.scssの拡張子で)
//                     ├──images
//                     ├──json
//                     │   └──config.json (ejs内で使う変数を定義するjsonファイル 作成必須 中身は空でも可 "{}" )
//                     │ 
//                     └──js
//                         └──plugins (jsのプラグインなどコンパイル不要、またはしたくないファイルの置き場)
//
// このディレクトリでのパスの設定なので変えたい場合は適宜編集
const path = {
    scssfiles: ['src/assets/scss/**/*.scss', '!src/assets/scss/**/_*.scss'], 
    destCssFiles: ['dist/assets/css/'],

    ejsFiles: ['src/**/*.ejs', '!src/**/_*.ejs'],
    destEjsFiles: ['dist/'],

    pluginFiles: ['src/assets/js/plugins/**/*'],
    destPluginFiles: ['dist/assets/js/plugins/'],

    es6Files: ['src/assets/js/**/*.js', '!src/assets/js/plugins/**/*'],
    destEs6Files: ['dist/assets/js/'],

    imageFiles: ['src/assets/images/**/*'],
    destImageFiles: ['dist/assets/images/'], // ここを変える場合はnewerのパスの指定も変える newer部分で原因不明のエラーが出て変数が使えない為

    jsonDataFile: ['src/assets/json/config.json'] // ejs内で使う変数データをこのファイルに
};

const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass'); // sassをcssにコンパイル
const autoprefixer = require('gulp-autoprefixer'); // ベンダープレフィックスを自動付加
const ejs = require('gulp-ejs'); // ejsをコンパイル
const rename = require('gulp-rename'); // 拡張子を変える
const babel = require('gulp-babel'); // es6移行のjavascriptをコンパイル
const eslint = require('gulp-eslint'); // javascriptのチェック
const imagemin = require('gulp-imagemin'); // 画像の圧縮
const newer = require('gulp-newer'); // 新しいファイルだけを判別する
const browserSync = require('browser-sync').create(); // ブラウザとのシンクロ
const plumber = require('gulp-plumber'); // エラーが出てもwatchを止めない
const notify = require('gulp-notify'); // エラー通知をだす
const fs = require('fs'); // jsonを渡すためのfile system
const json = JSON.parse(fs.readFileSync('src/assets/json/config.json')); // ejs内で使う変数データ

const browser = done => {
    browserSync.init({
        server: {
            baseDir: 'dist' // localhostでブラウザが開いた時のルートの設定
        },
        port: 3000
    });
    done();
};

const browserSyncReload = done => {
    browserSync.reload();
    done();
};

const compileSass = () =>
    src(path.scssfiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(
        sass({
            // outputStyleのオプション nested, expanded, compact, compressed
            // 通常の場合 expanded
            // minの場合 compressed
            outputStyle: 'expanded'
        })
    )
    .pipe(autoprefixer(['last 2 versions', 'ie >= 11', 'android > 4.4.4'])) // ベンダープレフィックスを自動で付加するブラウザの設定
    .pipe(dest(path.destCssFiles))
    .pipe(browserSync.stream());

const copyPlugins = () =>
    src(path.pluginFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(dest(path.destPluginFiles));

const compileEjs = () =>
    src(path.ejsFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(ejs({
        jsonData: json // config.jsonの読み込み
    }))
    .pipe(rename({extname: '.html'}))
    .pipe(dest(path.destEjsFiles))
    .pipe(browserSync.stream());

const scriptsLint = () =>
    src(path.es6Files)
    .pipe(plumber({
        errorHandler: notify.onError('<%= error.message %>'),
        fix: true
    }))
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

const compileEs6 = () =>
    src(path.es6Files)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest(path.destEs6Files))
    .pipe(browserSync.stream());

const minifyImage = () =>
    src(path.imageFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(newer('dist/assets/images/')) // destImageFilesのファイルパスを変えた場合はここも必ず変える
    .pipe(imagemin())
    .pipe(dest(path.destImageFiles));

const watchFiles = () => {
    watch(path.scssfiles, compileSass);
    watch(path.ejsFiles, compileEjs);
    watch(path.es6Files, series(scriptsLint, compileEs6));
    watch(path.imageFiles, minifyImage);
    watch(path.pluginFiles, copyPlugins);
    watch('dist/**/*', browserSyncReload);
};

const firstBuild = parallel(compileSass, copyPlugins, compileEjs, series(scriptsLint, compileEs6), minifyImage);
const watchParallel = parallel(browser, watchFiles);

exports.build = firstBuild;
exports.default = watchParallel;
