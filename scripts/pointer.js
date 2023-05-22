$('body').prepend('<div class="node"></div>');
$('body').prepend('<div class="cursor"></div>');
(function($) {
  init_pointer = function(options) {
    /////////////////////////////
    // options parameters
    // var defaults = {
    //  cursor: true or false,
    //  node: true or false,
    //  cursor_velocity: slow < 1 > fast,
    //  node_velocity: slow < 1 > fast,
    //  element_to_hover: disable or any css selector,
    //  cursor_class_hover: disable or expand,
    //  node_class_hover: disable or expand
    //  }
    /////////////////////////////
    // var
    var settings = $.extend({}, options);
    var node, cursor, request;
    var playing = true;
    var scroll = false;
    var scrollDown = false;
    var cursor_mouseX = 0;
    var cursor_mouseY = 0;
    var node_mouseX = 0;
    var node_mouseY = 0;
    var cursor_xp = 0;
    var cursor_yp = 0;
    var node_xp = 0;
    var node_yp = 0;
    var lastScrollTop = 0;
    if (settings.cursor === true) {
      cursor = $(".cursor");
      cursor.addClass('position-fixed');
    }
    if (settings.node === true) {
      node = $(".node");
      node.addClass('position-fixed');
    }
    var cursor_width = cursor.width() / 2;
    var cursor_height = cursor.width() / 2;
    var node_width = node.width() / 2;
    var node_height = node.width() / 2;

    function mouseStopped() {
      playing = false;
    }

    $(document).mouseleave(function(){
      hide_cursor();
    });

    function hide_cursor() {
      clearTimeout();
      setTimeout(mouseStopped, 0);
    }

    $(document).mousemove(function(e) {
      playing = true;
      if (settings.cursor === true) {
        cursor_mouseX = e.pageX - cursor_width;
        cursor_mouseY = e.pageY - cursor_height - lastScrollTop;
      }
      if (settings.node === true) {
        node_mouseX = e.pageX - node_width;
        node_mouseY = e.pageY - node_height - lastScrollTop;
      }
    });

    $(window).scroll(function(e){
      scroll = true;
      var st = $(this).scrollTop();
      if (st > lastScrollTop){
        scrollDown = true;
      }
      lastScrollTop = st;
    });
    $.fn.scrollStopped = function(callback) {
      var that = this, $this = $(that);
      $this.scroll(function(e) {
        clearTimeout($this.data('scrollTimeout'));
        $this.data('scrollTimeout', setTimeout(callback.bind(that), 125, e));
      });
    };
    $(window).scrollStopped(function(e){
      scroll = false;
      scrollDown = false;
    });
    if(settings.cursor_class_click === 'cursorClickEffect' && settings.node_class_click === 'nodeClickEffect'){
      function clickEffect(e){
        cursor.addClass('cursorClickEffect');
        cursor[0].addEventListener('animationend',function(){cursor.removeClass('cursorClickEffect');}.bind());
        node.addClass('nodeClickEffect');
        node[0].addEventListener('animationend',function(){node.removeClass('nodeClickEffect');}.bind());
      }
      document.addEventListener('click',clickEffect);
    }

    function render() {
      if (playing === true) {
        if (settings.cursor === true) {
          cursor.addClass('moving');
          if(scroll !== true){
            cursor_xp += ((cursor_mouseX - cursor_xp) * settings.cursor_velocity);
            cursor_yp += ((cursor_mouseY - cursor_yp - document.documentElement.scrollTop) * settings.cursor_velocity);
            cursor.css({
              left: cursor_xp + 'px',
              top: cursor_yp + 'px'
            });
          }
        }
        if (settings.node === true) {
          node.addClass('moving');
          if(scroll === true){
            if(scrollDown === true){
              node_yp += -0.25;
            } else {
              node_yp += 0.25;
            }
            node.css({
              top: node_yp + 'px'
            });
          } else {
            node_xp += ((node_mouseX - node_xp) * settings.node_velocity);
            node_yp += ((node_mouseY - node_yp - document.documentElement.scrollTop) * settings.node_velocity);
            node.css({
              left: node_xp + 'px',
              top: node_yp + 'px'
            });
          }
        }
      } else {
        if (settings.cursor === true) {
          cursor.removeClass('moving');
        }
        if (settings.node === true) {
          node.removeClass('moving');
        }
        cancelAnimationFrame(request);
      }
      if (settings.element_to_hover !== 'disable') {
        if ($(settings.element_to_hover + ':hover').length != 0) {
          if (settings.cursor === true) {
            if (settings.cursor_class_hover !== 'disable') {
              cursor.addClass(settings.cursor_class_hover);
            }
          }
          if (settings.node === true) {
            if (settings.node_class_hover !== 'disable') {
              node.addClass(settings.node_class_hover);
            }
          }
        } else {
          if (cursor.hasClass(settings.cursor_class_hover)) {
            cursor.removeClass(settings.cursor_class_hover)
          }
          if (node.hasClass(settings.node_class_hover)) {
            node.removeClass(settings.node_class_hover)
          }
        }
      }
      request = requestAnimationFrame(render);
    }
    request = requestAnimationFrame(render);
    window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  }
})(jQuery);

$( function() {
  init_pointer({
    cursor : true,
    node : true,
    cursor_velocity : 1,
    node_velocity : 0.15,
    element_to_hover : '.nodeHover',
    cursor_class_hover : 'expand',
    node_class_hover : 'expand',
    cursor_class_click : 'cursorClickEffect',
    node_class_click : 'nodeClickEffect'
  });
});
