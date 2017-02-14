/**
 * distIndexPage.js
 */
module.exports = function(broccoli, pathDistDir, callback){
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var fs = require('fs');
	var _this = this;
	var pkgList;

	it79.fnc({},
		[
			function(it1){
				// broccoliモジュールパッケージの一覧を取得
				broccoli.getPackageList(function(_pkgList){
					pkgList = _pkgList;
					// console.log(_pkgList);
					it1.next();
				});
			},
			function(it1){
				// build index.html
				mkIndexHtml(function(html){
					fs.writeFile( require('path').resolve(pathDistDir, 'index.html'), html, {}, function(){
						it1.next();
					})
				});
			},
			function(it1){
				callback(true);
			}
		]
	);

	/**
	 * ejs テンプレートにデータをバインドする
	 */
	function bindEjs( tpl, data, options ){
		var ejs = require('ejs');
		var rtn = '';
		try {
			var template = ejs.compile(tpl.toString(), options);
			rtn = template(data);
		} catch (e) {
			var errorMessage = 'TemplateEngine "EJS" Rendering ERROR.';
			console.error( errorMessage );
			rtn = errorMessage;
		}

		return rtn;
	}

	/**
	 * index.html のHTMLソースを作成する
	 */
	function mkIndexHtml(callback){
		var html = '';
		html = bindEjs(
			require('fs').readFileSync( __dirname+'/../tpls/index.html.ejs' ),
			{
				'pkgList': pkgList
			}
		);
		callback(html);
		return;
	}
}
