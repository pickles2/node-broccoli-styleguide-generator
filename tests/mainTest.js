var assert = require('assert');
var Broccoli = require('broccoli-html-editor');
var BroccoliStuleGuideGen = require('../libs/main.js');

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

describe('test', function() {

	it('test', function(done) {
		this.timeout(10*1000);
		createBroccoli(function(broccoli){
			var broccoliStyleGuideGen = new BroccoliStuleGuideGen(broccoli);
			broccoliStyleGuideGen.generate(__dirname+'/dist/', {}, function(){
				assert.equal( 1, 1 );
				done();
			});
		});
	});

});
