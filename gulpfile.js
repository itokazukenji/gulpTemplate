'use strict'

// 読み取るファイル、書き出すファイルのパス設定
//
// 作業ディレクトリ
//       ├────────dist (自動で生成され、全てのファイルはこのディレクトリ以下に吐き出される。基本中身はいじらない)
//       └────────src
//                 ├──index.html (index.ejs)
//                 └──assets
//                     ├──css (.scssの拡張子で)
//                     ├──images
//                     └──js
//                         └──plugins (jsのプラグインなどコンパイル不要、またはしたくないファイルの置き場)
//
// このディレクトリでのパスの設定なので変えたい場合は適宜編集
const path = {
    scssfiles: ['src/assets/css/**/*.scss'], 
    destCssFiles: ['dist/assets/css/'],

    ejsFiles: ['src/**/*.ejs'],
    destEjsFiles: ['dist/'],

    pluginFiles: ['src/assets/js/plugins/**/*'],
    destPluginFiles: ['dist/assets/js/plugins/'],

    es6Files: ['src/assets/js/**/*.js', '!src/assets/js/plugins/**/*'],
    destEs6Files: ['dist/assets/js/'],

    imageFiles: ['src/assets/images/**/*'],
    destImageFiles: ['dist/assets/images/'] // ここを変える場合はnewerのパスの指定も変える newer部分で原因不明のエラーが出て変数が使えない為
}


const {src, dest, watch, series, parallel} = require('gulp')
const sass = require('gulp-sass') // sassをcssにコンパイル
const autoprefixer = require('gulp-autoprefixer') // ベンダープレフィックスを自動付加
const ejs = require('gulp-ejs') // ejsをコンパイル
const rename = require('gulp-rename') // 拡張子を変える
const mediaQueries = require('gulp-group-css-media-queries') // 別な場所に書いたメデイアクエリをまとめる
const babel = require('gulp-babel') // es6移行のjavascriptをコンパイル
const eslint = require('gulp-eslint') // javascriptのチェック
const imagemin = require('gulp-imagemin') // 画像の圧縮
const newer = require('gulp-newer') // 新しいファイルだけを判別する
const browserSync = require('browser-sync').create() // ブラウザとのシンクロ
const plumber = require('gulp-plumber') // エラーが出てもwatchを止めない
const notify = require('gulp-notify') // エラー通知をだす

const browser = (done) => {
    browserSync.init({
        server: {
            baseDir: 'dist' // localhostでブラウザが開いた時のルートの設定
        },
        port: 3000
    })
    done()
}

const browserSyncReload = (done) => {
    browserSync.reload()
    done()
}

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
    .pipe(mediaQueries())
    .pipe(autoprefixer(['last 2 versions', 'ie >= 11', 'android > 4.4.4'])) // ベンダープレフィックスを自動で付加するブラウザの設定
    .pipe(dest(path.destCssFiles))
    .pipe(browserSync.stream())

const copyPlugins = () =>
    src(path.pluginFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(dest(path.destPluginFiles))

const compileEjs = () =>
    src(path.ejsFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(ejs())
    .pipe(rename({extname: '.html'}))
    .pipe(dest(path.destEjsFiles))
    .pipe(browserSync.stream())

const scriptsLint = () =>
    src(path.es6Files)
    .pipe(plumber({
        errorHandler: notify.onError('<%= error.message %>'),
        fix: true
    }))
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())

const compileEs6 = () =>
    src(path.es6Files)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest(path.destEs6Files))
    .pipe(browserSync.stream())

const minifyImage = () =>
    src(path.imageFiles)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(newer('dist/assets/images/'))
    .pipe(imagemin())
    .pipe(dest(path.destImageFiles))    

const watchFiles = () =>
    watch(path.scssfiles, compileSass)
    watch(path.ejsFiles, compileEjs)
    watch(path.es6Files, parallel(scriptsLint, compileEs6))
    watch(path.imageFiles, minifyImage)
    watch(path.pluginFiles, copyPlugins)
    watch('dist/**/*', browserSyncReload)

const watchParallel = parallel(browser, watchFiles)

exports.default = watchParallel