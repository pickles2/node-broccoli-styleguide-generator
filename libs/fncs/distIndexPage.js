/**
 * distIndexPage.js
 */
module.exports = function(main, pathDistDir, callback){
	var _this = this;
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var fs = require('fs');
	var fsx = require('fs-extra');
	var pkgList = main.getPackageList();
	var modList = main.getAllModuleList();
	var pathContSample = require('path').resolve(pathDistDir, 'index_files/contents_sample.html');

	var counter = {
		'count': 0,
		'packages': {}
	};

	it79.fnc({},
		[
			function(it1){
				// contents_sample.html を一旦削除
				try {
					fs.unlinkSync(pathContSample);
				} catch (e) {}
				it1.next();
			},
			function(it1){
				// モジュールのその他の情報を取得
				it79.ary(
					pkgList,
					function(it2, pkg, pkgId){
						counter.packages[pkgId] = {
							'count': 0,
							'id': pkgId,
							'name': pkg.packageName,
							'categories': {}
						};
						it79.ary(
							pkg.categories,
							function(it3, category, categoryId){
								counter.packages[pkgId].categories[categoryId] = {
									'count': 0,
									'id': categoryId,
									'name': category.categoryName
								};
								it79.ary(
									category.modules,
									function(it4, mod, modId){
										// console.log(mod);
										// console.log(modList[mod.moduleId]);

										counter.count ++;
										counter.packages[pkgId].count ++;
										counter.packages[pkgId].categories[categoryId].count ++;

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

										// finalize.js
										mod.finalizeJs = '';
										if( utils79.is_file(mod.realpath+'/finalize.js') ){
											mod.finalizeJs = require('fs').readFileSync(mod.realpath+'/finalize.js').toString();
										}

										// finalize.php
										mod.finalizePhp = '';
										if( utils79.is_file(mod.realpath+'/finalize.php') ){
											mod.finalizePhp = require('fs').readFileSync(mod.realpath+'/finalize.php').toString();
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
													var html = fs.readFileSync(pathFrom);
													mod.codingExample.push({
														'path': pkg.packageId+'/'+category.categoryId+'/'+modId+'/'+codingExampleHtmlList[idx],
														'src': html
													});
													var htmlFin = '';
													htmlFin += '<!doctype html>'+"\n";
													htmlFin += '<html>'+"\n";
													htmlFin += '<head>'+"\n";
													htmlFin += '<meta charset="UTF-8" />'+"\n";
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
													fs.appendFileSync(pathContSample, html+"\n");
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
				'siteInfo': main.getSiteInfo(),
				'pkgList': pkgList,
				'modList': modList,
				'counter': counter
			}
		);
		callback(html);
		return;
	}
}
