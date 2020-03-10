var assert = require('assert');
var Broccoli = require('broccoli-html-editor');
var BroccoliStuleGuideGen = require('../libs/main.js');
var utils79 = require('utils79');
var fsx = require('fs-extra');

function createBroccoli(callback){
	var broccoli = new Broccoli();
	broccoli.init({
		'appMode': 'web', // 'web' or 'desktop'. default to 'web'
		'paths_module_template': {
			'testMod1': __dirname+'/broccoliModules/mod1/' ,
			'testMod2': __dirname+'/broccoliModules/mod2/'
		} ,
		'documentRoot': __dirname+'/htdocs/', // realpath
		'pathHtml': '/index.html',
		'pathResourceDir': '/index_files/resources/',
		'realpathDataDir': __dirname+'/htdocs/index_files/guieditor.ignore/'
	}, function(){
		callback(broccoli);
	});
}

describe('cleaning', function() {

	it('cleaning...', function(done) {
		fsx.unlinkSync( __dirname+'/dist/index.html' );
		fsx.removeSync( __dirname+'/dist/index_files/' );
		done();
	});

});

describe('Build StyleGuild', function() {

	it('Build StyleGuild', function(done) {
		this.timeout(10*1000);
		createBroccoli(function(broccoli){
			var broccoliStyleGuideGen = new BroccoliStuleGuideGen({
				"siteTitle": "Broccoli Sample",
				"gpiBridge": function(api, options, callback){
					broccoli.gpi(api, options, callback);
					return;
				}
			});
			broccoliStyleGuideGen.generate(__dirname+'/dist/', function(result){
				assert.ok( utils79.is_file( __dirname+'/dist/index_files/scripts.js' ) );
				assert.ok( utils79.is_file( __dirname+'/dist/index_files/styles.css' ) );
				done();
			});
		});
	});

});
