(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function() {
    var duration = 300;
    var $sidebar = $('.sidebar');
    var $button = $('.button');
    var $content = $('.module-content');
    var $sidemenu_key = $('.sidemenu_key');

    $button.addClass('open');
    $button.click(function() {
        $button.toggleClass('close');
        $button.removeClass('open');
        if ($button.hasClass('close')) {
            $button.addClass('open');
            
            $sidemenu_key.text('←');

            $sidebar.css({
                'right':'-390px',
                'width':''
            });
            
            $content.stop().animate({
                width: '100%'
            }, duration, 'easeOutQuint');
        } else {
        	$sidemenu_key.text('→');

            $sidebar.css({
                'right': '0',
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

},{}]},{},[1])