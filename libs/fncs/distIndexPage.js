/**
 * distIndexPage.js
 */
module.exports = function(broccoli, pathDistDir, callback){
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var fs = require('fs');
	var fsx = require('fs-extra');
	var _this = this;
	var pkgList,
		modList;

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
				// 全broccoliモジュールの一覧を取得
				broccoli.getAllModuleList(function(_modList){
					modList = _modList;
					// console.log(_modList);
					it1.next();
				});
			},
			function(it1){
				// モジュールのその他の情報を取得
				it79.ary(
					pkgList,
					function(it2, pkg){
						it79.ary(
							pkg.categories,
							function(it3, category){
								it79.ary(
									category.modules,
									function(it4, mod, modId){
										// console.log(mod);
										// console.log(modList[mod.moduleId]);

										// template
										mod.template = modList[mod.moduleId].template;

										// CSS
										mod.css = '';
										if( utils79.is_file(mod.realpath+'/module.css') ){
											mod.css = require('fs').readFileSync(mod.realpath+'/module.css').toString();
										}else if( utils79.is_file(mod.realpath+'/module.css.scss') ){
											mod.css = require('fs').readFileSync(mod.realpath+'/module.css.scss').toString();
										}

										// JavaScript
										mod.js = '';
										if( utils79.is_file(mod.realpath+'/module.js') ){
											mod.js = require('fs').readFileSync(mod.realpath+'/module.js').toString();
										}

										// coding-example
										mod.codingExample = [];
										var codingExampleHtmlList = [];
										if( utils79.is_dir(mod.realpath+'/coding-example/') ){
											var codingExampleHtmlList = require('fs').readdirSync(mod.realpath+'/coding-example/');
											for( var idx in codingExampleHtmlList ){
												var pathFrom = mod.realpath+'/coding-example/'+codingExampleHtmlList[idx];
												var pathTo = require('path').resolve(pathDistDir, 'index_files/coding-example/'+pkg.packageId+'/'+category.categoryId+'/'+modId+'/'+codingExampleHtmlList[idx]);
												if( utils79.is_file(pathFrom) ){
													mod.codingExample.push( pkg.packageId+'/'+category.categoryId+'/'+modId+'/'+codingExampleHtmlList[idx] );
													var html = fs.readFileSync(pathFrom);
													var htmlFin = '';
													htmlFin += '<!doctype html>'+"\n";
													htmlFin += '<html>'+"\n";
													htmlFin += '<head>'+"\n";
													htmlFin += '<title>codine-example</title>'+"\n";
													htmlFin += '<link rel="stylesheet" href="../../../../styles.css" />'+"\n";
													htmlFin += '<script src="../../../../scripts.js"></script>'+"\n";
													htmlFin += '</head>'+"\n";
													htmlFin += '<body>'+"\n";
													htmlFin += html+"\n";
													htmlFin += '</body>'+"\n";
													htmlFin += '</html>'+"\n";
													fsx.mkdirpSync(utils79.dirname(pathTo));
													fs.writeFileSync(pathTo, htmlFin);
												}else if( utils79.is_dir(pathFrom) ){
													fsx.copySync(
														pathFrom,
														pathTo
													);
												}
											}

										}
										// console.log(mod.codingExample);
										it4.next();
									},
									function(){
										it3.next();
									}
								);
							},
							function(){
								it2.next();
							}
						);
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
				'pkgList': pkgList,
				'modList': modList
			}
		);
		callback(html);
		return;
	}
}
