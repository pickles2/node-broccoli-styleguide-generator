/**
 * broccoli-styleguide-generator.js
 */
module.exports = function(options){
	var _this = this;
	var fs = require('fs');
	var it79 = require('iterate79');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;
	var siteInfo = {};
	var pkgList,
		modList;

	options = options || {};
	options.gpiBridge = options.gpiBridge || function(api, options, callback){
		console.error('gpiBridge() not set.');
		callback(false);
	};
	if( options.siteTitle ){
		siteInfo.title = options.siteTitle;
	}

	/**
	 * Generate Style Guide
	 */
	this.generate = function(pathDistDir, callback){
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
					// broccoliモジュールパッケージの一覧を取得
					_this.broccoliGpi('getModulePackageList', {}, function(result){
						// console.log(result);
						pkgList = result;
						it1.next();
						return;
					});
					return;
				},
				function(it1){
					// 全broccoliモジュールの一覧を取得
					_this.broccoliGpi('getAllModuleList', {}, function(result){
						// console.log(result);
						modList = result;
						it1.next();
						return;
					});
					return;
				},
				function(it1){
					// リソースを出力
					// CSS と JavaScript をビルドして出力します。
					var fnc = require('./fncs/distResources.js');
					fnc(
						_this,
						pathDistDir,
						function(result){
							it1.next();
						}
					);
				} ,
				function(it1){
					// モジュール一覧ページを出力
					var fnc = require('./fncs/distModuleListPage.js');
					fnc(
						_this,
						pathDistDir,
						function(result){
							it1.next();
						}
					);
				} ,
				function(it1){
					// 扉ページを出力
					var fnc = require('./fncs/distIndexPage.js');
					fnc(
						_this,
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

	/**
	 * サイトの情報を取得する
	 */
	this.getSiteInfo = function(){
		return siteInfo;
	}

	/**
	 * broccoli の GPI をコールする
	 */
	this.broccoliGpi = function(api, opts, callback){
		options.gpiBridge(api, opts, callback);
		return;
	}

	this.getPackageList = function(){
		return pkgList;
	}
	this.getAllModuleList = function(){
		return modList;
	}

}
