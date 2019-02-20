/*!
 * jquery.xqTimePicker v1.0.0
 * Copyright 2019 xieqian.
 * Licensed under the MIT license
 */
"use strict";

!function (win, $, undefined) {
  var Prefix = "xq-";
  var TimePickerID = "xqTimePicker" + Math.random().toString().slice(2, 12);
  var Interval = 5;
  var CrtElement = null;
  var IsShow = false;
  $.extend({
    $timePicker: function $timePicker(option) {
      console.log(option);
    }
  }); // 时间选择器插件

  $.fn.extend({
    timePicker: function timePicker(option) {
      console.log("option", option);
      this.each(function () {
        $(this).on("click", function () {
          CrtElement = this;
          showTimePicker();
          showTimePicker.call(this);
        });
      });
    }
  });

  function showTimePicker() {
    uiUtil.show();
    uiUtil.setValue();
    uiUtil.location();
  }

  function closeTimePicker() {
    elementUtil.getTimePicker().hide();
    IsShow = false;
  }

  var uiUtil = {
    show: function show() {
      if (elementUtil.getTimePicker().length === 0) {
        var result = htmlUtil.get();
        $("body").append(result);
        eventUtil.init();
      }
    },
    reset: function reset() {
      elementUtil.getTimePicker().find(".active").removeClass("active");
      elementUtil.getTimePickerHour().scrollTop(0);
      elementUtil.getTimePickerMinute().scrollTop(0);
    },
    setValue: function setValue() {
      var crtValue = $(CrtElement).val();
      this.reset();

      if (/^\d{2}:\d{2}$/.test(crtValue)) {
        this.setStatus(crtValue);
      }
    },
    setStatus: function setStatus(val) {
      var arr = val.split(":");
      var hour = arr[0];
      var minute = arr[1];
      var hourItem = elementUtil.getTimePickerHour().find("li:contains(".concat(hour, ")"));
      var mimuteItem = elementUtil.getTimePickerMinute().find("li:contains(".concat(minute, ")"));
      hourItem.addClass("active");
      mimuteItem.addClass("active");
      this.scrollFixedPositionByElement(hourItem);
      this.scrollFixedPositionByElement(mimuteItem);
    },
    scrollFixedPositionByElement: function scrollFixedPositionByElement(ele) {
      var isAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var $this = $(ele);
      var scrollNum = 3;
      var index = $this.index();
      var scrollHeight = $this[0].scrollHeight;
      var scrollTop = scrollHeight * index - scrollHeight * scrollNum;
      $this.parent().animate({
        scrollTop: scrollTop
      }, isAnimate ? 300 : 0);
    },
    location: function location() {
      var zIndex = uiUtil.getMaxZIndex();
      elementUtil.getTimePicker().css({
        display: "block",
        zIndex: zIndex + 100
      });
      this.locationPosition();
      IsShow = true;
    },
    locationPosition: function locationPosition() {
      var offsetLeft = CrtElement.offsetLeft;
      var offsetTop = CrtElement.offsetTop + CrtElement.offsetHeight + Interval;
      elementUtil.getTimePicker().css({
        left: offsetLeft,
        top: offsetTop
      });
    },
    getMaxZIndex: function getMaxZIndex() {
      var max = Math.max.apply(null, $.map($("body *"), function (ele, index) {
        if ($(ele).css("position") != "static") {
          return parseInt($(ele).css('z-index')) || 1;
        } else {
          return -1;
        }
      }));
      return max;
    }
  };
  var elementUtil = {
    getTimePickerHour: function getTimePickerHour() {
      return this.getTimePicker().find(".".concat(Prefix, "time-picker-hour"));
    },
    getTimePickerMinute: function getTimePickerMinute() {
      return this.getTimePicker().find(".".concat(Prefix, "time-picker-minute"));
    },
    getTimePicker: function getTimePicker() {
      return $("#".concat(TimePickerID));
    }
  };
  var htmlUtil = {
    get: function get() {
      var result = [];
      result.push("<div id=\"".concat(TimePickerID, "\" class=\"").concat(Prefix, "time-picker\">"));
      result.push(this.header());
      result.push(this.body());
      result.push(this.footer());
      result.push("</div>");
      return result.join("");
    },
    header: function header() {
      var result = [];
      result.push("<div class=\"".concat(Prefix, "time-picker-header\">"));
      result.push("<span>时</span>");
      result.push("<span>分</span>");
      result.push("</div>");
      return result.join("");
    },
    body: function body() {
      var result = [];
      result.push("<div class=\"".concat(Prefix, "time-picker-body\">"));
      result.push(this.hour());
      result.push(this.minute());
      result.push("</div>");
      return result.join("");
    },
    footer: function footer() {
      var result = [];
      result.push("<div class=\"".concat(Prefix, "time-picker-footer\">"));
      result.push(this.button("取消", "cancel"));
      result.push(this.button("现在", "now"));
      result.push(this.button("确认", "ok"));
      result.push("</div>");
      return result.join("");
    },
    hour: function hour(activeNum) {
      var result = [];
      result.push("<ul class=\"".concat(Prefix, "time-picker-hour\">"));

      for (var i = 0; i < 24; i++) {
        if (i === activeNum) {
          result.push("<li class=\"active\">".concat(util.formatTime(i), "</li>"));
        } else {
          result.push("<li>".concat(util.formatTime(i), "</li>"));
        }
      }

      result.push("</ul>");
      return result.join("");
    },
    minute: function minute(activeNum) {
      var result = [];
      result.push("<ul class=\"".concat(Prefix, "time-picker-minute\">"));

      for (var i = 0; i < 60; i++) {
        if (i === activeNum) {
          result.push("<li class=\"active\">".concat(util.formatTime(i), "</li>"));
        } else {
          result.push("<li>".concat(util.formatTime(i), "</li>"));
        }
      }

      result.push("</ul>");
      return result.join("");
    },
    button: function button(text, type) {
      return "<button class=\"".concat(Prefix, "time-picker-button ").concat(type, "\" data-type=\"").concat(type, "\">").concat(text, "</button>");
    }
  };
  var eventUtil = {
    init: function init() {
      var _this = this;

      $(window).resize(function () {
        if (IsShow) {
          uiUtil.locationPosition();
        }
      });
      elementUtil.getTimePicker().find(".".concat(Prefix, "time-picker-body")).hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
      $("#".concat(TimePickerID, " .").concat(Prefix, "time-picker-button")).click(function () {
        var type = $(this).data("type");
        _this[type] && _this[type].call(this);
      });
      $("#".concat(TimePickerID, " .").concat(Prefix, "time-picker-body")).on("click", "li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        uiUtil.scrollFixedPositionByElement(this, true);
      });
    },
    cancel: function cancel() {
      closeTimePicker();
    },
    now: function now() {
      $(CrtElement).val(util.getNowTime());
      closeTimePicker();
    },
    ok: function ok() {
      var _this = eventUtil;

      var hour = _this.getHour();

      var minute = _this.getMinute();

      $(CrtElement).val("".concat(hour, ":").concat(minute));
      closeTimePicker();
    },
    getHour: function getHour() {
      var hour = $("#".concat(TimePickerID, " .").concat(Prefix, "time-picker-hour li.active"));

      if (hour.length > 0) {
        return $(hour).html();
      } else {
        return "00";
      }
    },
    getMinute: function getMinute() {
      var minute = $("#".concat(TimePickerID, " .").concat(Prefix, "time-picker-minute li.active"));

      if (minute.length > 0) {
        return $(minute).html();
      } else {
        return "00";
      }
    }
  };
  var util = {
    formatTime: function formatTime(value) {
      return ("0000" + value.toString()).slice(-2);
    },
    getNowTime: function getNowTime() {
      var now = new Date();
      return "".concat(this.formatTime(now.getHours()), ":").concat(this.formatTime(now.getMinutes()));
    }
  };
}(window, jQuery);