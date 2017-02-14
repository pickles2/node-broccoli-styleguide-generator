/**
 * distResources.js
 */
module.exports = function(broccoli, pathDistDir, callback){
	var it79 = require('iterate79');
	var fs = require('fs');
	var fsx = require('fs-extra');

	it79.fnc({},
		[
			function(it1){
				// create index_files
				broccoli.buildModuleCss(function(css){
					fsx.mkdirp( require('path').resolve(pathDistDir, 'index_files/'), {}, function(){
						it1.next();
					})
				});
			},
			function(it1){
				// build CSS
				broccoli.buildModuleCss(function(css){
					fs.writeFile( require('path').resolve(pathDistDir, 'index_files/styles.css'), css, {}, function(){
						it1.next();
					})
				});
			},
			function(it1){
				// build JavaScript
				broccoli.buildModuleJs(function(js){
					fs.writeFile( require('path').resolve(pathDistDir, 'index_files/scripts.js'), js, {}, function(){
						it1.next();
					})
				});
			},
			function(it1){
				// copy styleguide resources
				fsx.copy(
					__dirname+'/../resources/',
					require('path').resolve(pathDistDir, 'index_files/resources/'),
					function(){
						it1.next();
					}
				);
			},
			function(it1){
				callback(true);
			}
		]
	);
}
