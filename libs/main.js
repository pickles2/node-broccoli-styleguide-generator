/**
 * broccoli-styleguide-generator.js
 */
module.exports = function(broccoli){
	var fs = require('fs');
	var it79 = require('iterate79');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;
	var _this = this;

	/**
	 * Generate Style Guide
	 */
	this.generate = function(pathDistDir, options, callback){
		callback = callback||function(){};
		it79.fnc( {},
			[
				function(it1){
					// 条件をチェック
					// - 出力先ディレクトリ
					if( !utils79.is_dir( pathDistDir ) ){
						console.error('DistDir is NOT exists.', pathDistDir);
						callback(false);
						return;
					}
					it1.next();
				} ,
				function(it1){
					// リソースを出力
					// CSS と JavaScript をビルドして出力します。
					var distResources = require('./fncs/distResources.js');
					distResources(
						broccoli,
						pathDistDir,
						function(result){
							it1.next();
						}
					);
				} ,
				function(it1){
					// 扉ページを出力
					var distIndexPage = require('./fncs/distIndexPage.js');
					distIndexPage(
						broccoli,
						pathDistDir,
						function(result){
							it1.next();
						}
					);
				} ,
				function(it1){
					// 完了
					callback(true);
				}
			]
		);
		return;
	}


}
