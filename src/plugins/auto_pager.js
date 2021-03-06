SF.pl.auto_pager = new SF.plugin((function($) {
  if (location.pathname === '/browse') return;
  var $more = $('#pagination-more');
  if (! $more.length) return;

  var is_loaded;

  var $win = $(window);
  var $html = $('html');
  var $totop = $('#pagination-totop');

  var current_pos;
  var mousewheel_down = false;
  var remain = 500;

  var onScroll = SF.fn.throttle(autoPager, 250);

  function autoPager() {
    if (! mousewheel_down) return;
    current_pos = SF.fn.scrollHandler.getScrollTop() + document.documentElement.clientHeight;
    if (current_pos <= $more.offset().top - remain)
      return;
    if ($more.hasClass('loading'))
      return;

    if (! $more.is(':hidden'))
      SF.fn.emulateClick($more[0]);
  }

  function onMousewheel(e) {
    mousewheel_down = e.originalEvent.wheelDeltaY < 0;
  }

  function onKeypress(e) {
    if (e.target !== document.body) return;
    if (e.ctrlKey || e.altKey) return;
    var key = e.which;
    switch (key) {
      case 97: case 116:
        e.preventDefault();
        break;
    }
    switch (key) {
      case 116:
        SF.fn.emulateClick($totop[0]);
        break;
      case 97:
        is_loaded ? unload() : load();
        break;
    }
  }

  function load() {
    if (is_loaded) return;
    is_loaded = true;

    SF.fn.scrollHandler.addListener(onScroll);
  }

  function unload() {
    if (! is_loaded) return;
    is_loaded = false;

    SF.fn.scrollHandler.removeListener(onScroll);
  }

  return {
    load: function() {
      load();
      $win.bind('keypress', onKeypress);
      $html.bind('mousewheel', onMousewheel);
    },
    unload: function() {
      unload();
      $win.unbind('keypress', onKeypress);
      $html.unbind('mousewheel', onMousewheel);
    }
  };
})(jQuery));
