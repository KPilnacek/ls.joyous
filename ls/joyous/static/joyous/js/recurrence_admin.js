(function() {
  var RecurrenceWidget;

  RecurrenceWidget = (function() {
    function RecurrenceWidget(widgetId) {
      var ourDiv;
      ourDiv = $("#" + widgetId);
      this.our = ourDiv.find.bind(ourDiv);
      this._init();
      return;
    }

    RecurrenceWidget.prototype._init = function() {
      var freq, showAdvanced;
      showAdvanced = this._hasAdvanced();
      this.our(".ev-show-advanced-cbx").prop("checked", showAdvanced);
      this.our(".ev-advanced-repeat").toggle(showAdvanced);
      freq = this.our(".ev-freq-choice > select").val();
      this._freqChanged(freq);
      this._primaryOrdDayChanged();
    };

    RecurrenceWidget.prototype._hasAdvanced = function() {
      var dayChoice, dtstart, interval, ordChoice, secondaryOrdDaySet, weekday, weekdaysTicked;
      interval = this.our(".ev-interval-num > input").val();
      if (interval && parseInt(interval, 10) > 1) {
        return true;
      }
      weekdaysTicked = this.our(".ev-weekdays :checkbox:checked").map(function() {
        return this.value;
      }).get();
      if (weekdaysTicked.length > 1) {
        return true;
      }
      dtstart = new Date(this.our(".ev-start-date > input").val());
      weekday = (dtstart.getDay() + 6) % 7;
      if (weekdaysTicked.length === 1 && parseInt(weekdaysTicked[0], 10) !== weekday) {
        return true;
      }
      ordChoice = this.our(".ev-primary .ev-ord-choice > select").val();
      if (parseInt(ordChoice, 10) !== 101) {
        return true;
      }
      dayChoice = this.our(".ev-primary .ev-day-choice > select").val();
      if (parseInt(dayChoice, 10) !== 200) {
        return true;
      }
      secondaryOrdDaySet = $(".ev-secondary select").is(function() {
        return $(this).val() !== "";
      });
      if (secondaryOrdDaySet) {
        return true;
      }
      return false;
    };

    RecurrenceWidget.prototype._clearAdvanced = function() {
      var dtstart, weekday;
      this.our(".ev-interval-num > input").val(1);
      this.our(".ev-weekdays :checkbox").prop("checked", false);
      dtstart = new Date(this.our(".ev-start-date > input").val());
      weekday = (dtstart.getDay() + 6) % 7;
      this.our(".ev-weekdays :checkbox[value=" + weekday + "]").prop("checked", true);
      this.our(".ev-primary .ev-ord-choice > select").val(101);
      this.our(".ev-primary .ev-day-choice > select").val(200);
      this.our(".ev-secondary select").val("").prop('disabled', true);
      this.our(".ev-month-choice > select").val(dtstart.getMonth() + 1);
    };

    RecurrenceWidget.prototype.enable = function() {
      this._enableShowAdvanced();
      this._enableStartDateChange();
      this._enableFreqChange();
      this._enableSecondaryOrdDayClear();
      this._enablePrimaryOrdDayChange();
    };

    RecurrenceWidget.prototype._enableShowAdvanced = function() {
      this.our(".ev-show-advanced-cbx").click((function(_this) {
        return function(ev) {
          if ($(ev.target).prop("checked")) {
            _this.our(".ev-advanced-repeat").show();
          } else {
            _this.our(".ev-advanced-repeat").hide();
            _this._clearAdvanced();
          }
          return true;
        };
      })(this));
    };

    RecurrenceWidget.prototype._enableStartDateChange = function() {
      this.our(".ev-start-date > input, .ev-").change((function(_this) {
        return function(ev) {
          var showAdvanced;
          showAdvanced = _this.our(".ev-show-advanced-cbx").prop("checked");
          if (!showAdvanced) {
            _this._clearAdvanced();
          }
          return false;
        };
      })(this));
    };

    RecurrenceWidget.prototype._enableFreqChange = function() {
      this.our(".ev-freq-choice > select").change((function(_this) {
        return function(ev) {
          _this._freqChanged($(ev.target).val());
          _this._clearAdvanced();
          return false;
        };
      })(this));
    };

    RecurrenceWidget.prototype._enableSecondaryOrdDayClear = function() {
      this.our(".ev-secondary .ev-ord-choice > select").change((function(_this) {
        return function(ev) {
          var row;
          if ($(ev.target).find("option:selected").val() === "") {
            row = $(ev.target).closest(".ev-double-field");
            row.find(".ev-day-choice > select").val("");
          }
          return false;
        };
      })(this));
      this.our(".ev-secondary .ev-day-choice > select").change((function(_this) {
        return function(ev) {
          var row;
          if ($(ev.target).find("option:selected").val() === "") {
            row = $(ev.target).closest(".ev-double-field");
            row.find(".ev-ord-choice > select").val("");
          }
          return false;
        };
      })(this));
    };

    RecurrenceWidget.prototype._enablePrimaryOrdDayChange = function() {
      this.our(".ev-primary select").change((function(_this) {
        return function(ev) {
          _this._primaryOrdDayChanged();
          return false;
        };
      })(this));
    };

    RecurrenceWidget.prototype._primaryOrdDayChanged = function() {
      var day, ord, ref, ref1;
      ord = this.our(".ev-primary .ev-ord-choice option:selected").val();
      day = this.our(".ev-primary .ev-day-choice option:selected").val();
      if ((-1 <= (ref = parseInt(ord, 10)) && ref <= 5) && (0 <= (ref1 = parseInt(day, 10)) && ref1 <= 6)) {
        this.our(".ev-secondary select").prop('disabled', false);
      } else {
        this.our(".ev-secondary select").val("").prop('disabled', true);
      }
    };

    RecurrenceWidget.prototype._freqChanged = function(freq) {
      var units, visible;
      visible = [false, false, false];
      units = "";
      switch (parseInt(freq, 10)) {
        case 3:
          visible = [false, false, false];
          units = "Day(s)";
          break;
        case 2:
          visible = [true, false, false];
          units = "Week(s)";
          break;
        case 1:
          visible = [false, true, false];
          units = "Month(s)";
          break;
        case 0:
          visible = [false, true, true];
          units = "Year(s)";
      }
      this.our(".ev-advanced-weekly-repeat").toggle(visible[0]);
      this.our(".ev-advanced-monthly-repeat").toggle(visible[1]);
      this.our(".ev-advanced-yearly-repeat").toggle(visible[2]);
      this.our(".ev-interval-units").text(units);
    };

    return RecurrenceWidget;

  })();

  this.initRecurrenceWidget = function(id) {
    var widget;
    widget = new RecurrenceWidget(id);
    widget.enable();
  };

  this.initExceptionDateChooser = function(id, validDates, dowStart) {
    var dtpOpts;
    if (dowStart == null) {
      dowStart = 0;
    }
    dtpOpts = {
      onGenerate: function(ct) {
        var dd, future, i, len, mm, past, results, yyyy, yyyymmdd;
        past = new Date();
        past.setDate(past.getDate() - 90);
        past.setDate(1);
        future = new Date();
        future.setDate(future.getDate() + 217);
        future.setDate(1);
        if (validDates !== -1 && (past < ct && ct < future)) {
          $(this).find('td.xdsoft_date').addClass('xdsoft_disabled');
          results = [];
          for (i = 0, len = validDates.length; i < len; i++) {
            yyyymmdd = validDates[i];
            yyyy = parseInt(yyyymmdd.slice(0, 4), 10);
            mm = parseInt(yyyymmdd.slice(4, 6), 10) - 1;
            dd = parseInt(yyyymmdd.slice(6, 8), 10);
            results.push($(this).find("td.xdsoft_date[data-year=" + yyyy + "][data-month=" + mm + "][data-date=" + dd + "]").removeClass('xdsoft_disabled'));
          }
          return results;
        }
      },
      closeOnDateSelect: true,
      timepicker: false,
      scrollInput: false,
      format: 'Y-m-d',
      dayOfWeekStart: dowStart
    };
    if (window.dateTimePickerTranslations) {
      dtpOpts['i18n'] = {
        lang: window.dateTimePickerTranslations
      };
      dtpOpts['lang'] = 'lang';
    }
    return $('#' + id).datetimepicker(dtpOpts);
  };

}).call(this);
