var _origin;
window.addEventListener(
    'message',
    function (event) {
		var data=event.data;
		_origin = event.origin;
        if(_origin === 'null'){_origin = '*';}
        // if(event.origin!='http://127.0.0.1:8080'){return;}// <- check your own server's origin.

        var $ = require('jquery');

        if(data.api == 'getHtmlContentHeightWidth'){
			var hw = {};
			hw.h = Math.max.apply( null, [document.body.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
			hw.w = Math.max.apply( null, [document.body.clientWidth, document.body.scrollWidth, document.documentElement.scrollWidth, document.documentElement.clientWidth] );
            hw.h = $('.broccoli-styleguide-bodyinner').outerHeight() + 64;
			callbackMessage(data.callback, hw);
			return;

		}
    }
);
function callbackMessage(callbackId, data){
    if(!_origin){return;}
    if(typeof(callbackId)!==typeof('')){return;}
    window.parent.postMessage(
        {
            'api':callbackId ,
            'options': data
        },
        _origin
    );
}
