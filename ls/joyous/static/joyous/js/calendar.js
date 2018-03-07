(function() {
  var EventsCalendar;

  EventsCalendar = (function() {
    function EventsCalendar() {
      return;
    }

    EventsCalendar.prototype.enable = function() {
      this._enablePopup();
      $(window).resize((function(_this) {
        return function() {
          return _this._handleResize();
        };
      })(this));
      this._handleResize();
    };

    EventsCalendar.prototype._enablePopup = function() {
      $("#overlay, .popup-outer, .popup .close").click(function() {
        $("#overlay, .popup-outer").hide();
        return false;
      });
      return $(".popup").click(function(event) {
        return event.stopPropagation();
      });
    };

    EventsCalendar.prototype._handleResize = function() {
      if ($("tbody").hasClass("monthly-view")) {
        this._squareDays();
      }
      return this._linkReadMore();
    };

    EventsCalendar.prototype._squareDays = function() {
      var height;
      height = $("tbody.monthly-view td.day").first().innerWidth() - 25;
      $("tbody.monthly-view .days-events").innerHeight(height);
    };

    EventsCalendar.prototype._linkReadMore = function() {
      $(".days-events").each((function(_this) {
        return function(index, element) {
          var day;
          day = $(element).closest("td.day");
          day.find("a.read-more").remove();
          if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
            _this._addReadMoreLink(day);
          }
        };
      })(this));
    };

    EventsCalendar.prototype._addReadMoreLink = function(day) {
      var link;
      link = $("<a>").attr('href', 'javascript:void 0').attr('title', "Show all of this day's events").addClass("read-more").text("+");
      link.click(function(ev) {
        var events, title, y;
        title = day.find(".day-title").clone();
        $("#read-more-events .day-title").replaceWith(title);
        events = day.find(".days-events").clone().height('auto');
        $("#read-more-events .days-events").replaceWith(events);
        y = Math.max(ev.pageY - 100, $(window).scrollTop());
        $(".popup-outer").css('top', y);
        $("#overlay, .popup-outer").show();
        return false;
      });
      day.append(link);
    };

    return EventsCalendar;

  })();

  $(function() {
    var calendar;
    calendar = new EventsCalendar();
    calendar.enable();
  });

}).call(this);
