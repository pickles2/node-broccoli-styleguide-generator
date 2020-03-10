# node-broccoli-styleguide-generator
Generate a styleguide consist of "broccoli-html-editor" modules.

## 使い方 - Usage

```js
var Broccoli = require('broccoli-html-editor');
var BroccoliStuleGuideGen = require('broccoli-styleguide-generator');

var broccoli = new Broccoli();
broccoli.init({
	/* 中略 */
}, function(){

	var broccoliStyleGuideGen = new BroccoliStuleGuideGen({
		"siteTitle": "Broccoli Sample"
	});
	broccoliStyleGuideGen.setBroccoli(broccoli);
	broccoliStyleGuideGen.generate(
		'/path/to/dist/',
		function(result){
			console.log('done!');
		}
	);

});

```

## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
