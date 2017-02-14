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
				// パッケージ名からモジュールの一覧を取得
				it79.ary(
					pkgList,
					function(it2, row, idx){
						broccoli.getModuleListByPackageId(row.packageId, function(_modList){
							console.log(_modList);
							console.log(_modList.categories);
							it2.next();
						});
					},
					function(){
						it1.next();
					}
				);
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
	 * index.html のHTMLソースを作成する
	 */
	function mkIndexHtml(callback){
		var html = '';
		html += '<!doctype html>'+"\n";
		html += '<html>'+"\n";
		html += '<head>'+"\n";
		html += '<title>broccoli-html-editor</title>'+"\n";
		html += '<link rel="stylesheet" href="./index_files/styles.css" />'+"\n";
		html += '<script src="./index_files/scripts.js"></script>'+"\n";
		html += '</head>'+"\n";
		html += '<body>'+"\n";
		html += '<h1>Style Guide</h1>'+"\n";
		it79.ary(pkgList,
			function(it1, row, idx){
				html += '<h2>'+ utils79.h( row.packageName ) +'</h2>'+"\n";
				it1.next();
			}, function(){
				html += '</body>'+"\n";
				html += '</html>'+"\n";
				callback(html);
			}
		);
		return;
	}
}
