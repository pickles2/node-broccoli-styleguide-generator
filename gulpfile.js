let gulp = require('gulp');
let sass = require('gulp-sass');//CSSコンパイラ
let autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
let minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
let uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
let concat = require('gulp-concat');//ファイルの結合ツール
let plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
let rename = require("gulp-rename");//ファイル名の置き換えを行う
let browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
let packageJson = require(__dirname+'/package.json');

// client-libs (frontend) を処理
gulp.task("client-libs:bootstrap", function() {
	return gulp.src(["node_modules/bootstrap/dist/**/*"])
		.pipe(gulp.dest( './libs/resources/bootstrap/' ))
	;
});
gulp.task("client-libs:px2style", function() {
	return gulp.src(["node_modules/px2style/dist/**/*"])
		.pipe(gulp.dest( './libs/resources/px2style/' ))
	;
});

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	return gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass({
			"sourceComments": false
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			extname: ''
		}))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest( './libs/resources/' ))

		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest( './libs/resources/' ))
	;
});

// .js (frontend) を処理
gulp.task(".js", function() {
	return gulp.src(["src/**/*.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(rename({
			extname: '.js'
		}))
		.pipe(gulp.dest( './libs/resources/' ))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest( './libs/resources/' ))
	;
});

let _tasks = gulp.parallel([
	'client-libs:bootstrap',
	'client-libs:px2style',
	'.css.scss',
	'.js'
]);

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	return gulp.watch(["src/**/*"], _tasks);
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
