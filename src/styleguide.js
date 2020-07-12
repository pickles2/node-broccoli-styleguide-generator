$(function() {
	var duration = 300;
	var $sidebar = $('.theme-sidebar');
	var $content = $('.module-content');
	var $sidebarToggleBtn = $('.theme-sidebar__toggle-btn');

	$sidebarToggleBtn.addClass('theme-sidebar__toggle-btn-open');
	$sidebarToggleBtn.click(function() {
		$sidebarToggleBtn.toggleClass('theme-sidebar__toggle-btn-close');
		$sidebarToggleBtn.removeClass('theme-sidebar__toggle-btn-open');
		if ($sidebarToggleBtn.hasClass('theme-sidebar__toggle-btn-close')) {
			$sidebarToggleBtn.addClass('theme-sidebar__toggle-btn-open');

			$sidebarToggleBtn.text('←');

			$sidebar.css({
				'right': 0,
				'width': 0
			});

			$content.stop().animate({
				width: '100%'
			}, duration, 'easeOutQuint');
		} else {
			$sidebarToggleBtn.text('→');

			$sidebar.css({
				'right': 0,
				'width': '25%'
			});

			$content.stop().animate({
				width: '75%'
			}, duration, 'easeOutQuint');
		};
	});

	var $tabs = $(".tabs a");

	$tabs.on('click', function(e) {
		e.preventDefault();
		var target = $(this).attr('href');
		if (! $(target).length) return false;
		$('.tab_item', $(this).closest('.tabs')).removeClass('active');
		$(this).closest('.tab_item').addClass('active');
		$('.panel', $(target).closest('.panels')).removeClass('active');
		$(target).addClass('active');
	});
});
$(window).on('load resize', function(){
	var $iframe = $('iframe');
	window.postMessenger
	$iframe.each(function(idx, elm){
		postMessenger.send(elm, 'getHtmlContentHeightWidth', {}, function(result){
			console.log(result);
			$(elm).height(result.h);
		});
		// console.log(idx, elm);
		// console.log(elm.contentWindow);
		// console.log($(elm.contentWindow).height());
		// console.log(elm.contentDocument);
		// console.log($(elm.contentDocument).height());
	});
});

/**
 * postMessenger.js
 * iframeに展開されるプレビューHTMLとの通信を仲介します。
 */
PostMessenger = function(){
	var $ = require('jquery');
	var callbackMemory = {};

	function createUUID(){
		return "uuid-"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
	}
	function getTargetOrigin(iframe){
		if(window.location.origin==='null' || window.location.origin=='file://' || window.location.origin.match(/^chrome\-extension\:\/\//)){
			return '*';
		}

		var url = $(iframe).attr('src');
		// console.log(url);
		var parser = document.createElement('a');
		parser.href=url;
		// console.log(parser);
		return parser.protocol+'//'+parser.host
	}

	/**
	 * メッセージを送る
	 */
	this.send = function(iframe, api, options, callback){
		callback = callback||function(){};

		var callbackId = createUUID();
		// console.log(callbackId);

		callbackMemory[callbackId] = callback; // callbackは送信先から呼ばれる。

		var message = {
			'api': api,
			'callback': callbackId,
			'options': options
		};
		// console.log(callbackMemory);

		var win = $(iframe).get(0).contentWindow;
		var targetWindowOrigin = getTargetOrigin(iframe);
		win.postMessage(message, targetWindowOrigin);
		return;
	}

	/**
	 * メッセージを受信する
	 */
	window.addEventListener('message',function(event){
		var data=event.data;
		// console.log(event);
		// console.log(callbackMemory);

		if(data.api == 'unselectInstance'){
			broccoli.unselectInstance();
			return;

		}else if(data.api == 'unfocusInstance'){
			broccoli.unfocusInstance();
			return;

		}else if(data.api == 'onClickContentsLink'){
			// console.log(event.data.options);
			var data = event.data.options;
			broccoli.options.onClickContentsLink(data.url, data);
			return;

		}else{
			if(!callbackMemory[data.api]){return;}
			callbackMemory[data.api](data.options);
			callbackMemory[data.api] = undefined;
			delete callbackMemory[data.api];
		}
		return;

	});

	return;
}
window.postMessenger = new PostMessenger();
