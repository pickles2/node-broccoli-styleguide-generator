# node-broccoli-styleguide-generator
Generate a styleguide consist of "broccoli-html-editor" modules.

## Usage

```js
var Broccoli = require('broccoli-html-editor');
var BroccoliStuleGuideGen = require('broccoli-styleguide-generator');

var broccoli = new Broccoli();
broccoli.init({
	/* 中略 */
}, function(){

	var broccoliStyleGuideGen = new BroccoliStuleGuideGen(broccoli);
	broccoliStyleGuideGen.generate('/path/to/dist/', {}, function(result){
		console.log('done!');
	});

});

```

## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
