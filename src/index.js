!(function (win, $, undefined) {
    let Prefix = "xq-";
    let TimePickerID = "xqTimePicker" + Math.random().toString().slice(2, 12);
    let Interval = 5;
    let CrtElement = null;
    let IsShow = false;

    $.extend({
        $timePicker: function (option) {
            console.log(option);
        }
    });

    // 时间选择器插件
    $.fn.extend({
        timePicker: function (option) {
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

    let uiUtil = {
        show() {
            if (elementUtil.getTimePicker().length === 0) {
                let result = htmlUtil.get();
                $("body").append(result);
                eventUtil.init();
            }
        },
        reset() {
            elementUtil.getTimePicker().find(".active").removeClass("active");
            elementUtil.getTimePickerHour().scrollTop(0);
            elementUtil.getTimePickerMinute().scrollTop(0);
        },
        setValue() {
            let crtValue = $(CrtElement).val();
            this.reset();
            if (/^\d{2}:\d{2}$/.test(crtValue)) {
                this.setStatus(crtValue);
            }
        },
        setStatus(val) {
            let arr = val.split(":");
            let hour = arr[0];
            let minute = arr[1];
            let hourItem = elementUtil.getTimePickerHour().find(`li:contains(${hour})`);
            let mimuteItem = elementUtil.getTimePickerMinute().find(`li:contains(${minute})`);
            hourItem.addClass("active");
            mimuteItem.addClass("active");
            this.scrollFixedPositionByElement(hourItem);
            this.scrollFixedPositionByElement(mimuteItem);
        },
        scrollFixedPositionByElement(ele, isAnimate = false) {

            let $this = $(ele);
            let scrollNum = 3;
            let index = $this.index();
            let scrollHeight = $this[0].scrollHeight;
            let scrollTop = scrollHeight * index - scrollHeight * scrollNum;

            $this.parent().animate({
                scrollTop: scrollTop
            },isAnimate ? 300 : 0);
        },
        location() {
            let zIndex = uiUtil.getMaxZIndex();
            elementUtil.getTimePicker().css({
                display: "block",
                zIndex: zIndex + 100
            });
            this.locationPosition();
            IsShow = true;
        },
        locationPosition() {
            let offsetLeft = CrtElement.offsetLeft;
            let offsetTop = CrtElement.offsetTop + CrtElement.offsetHeight + Interval;
            elementUtil.getTimePicker().css({
                left: offsetLeft,
                top: offsetTop
            });
        },
        getMaxZIndex() {
            let max = Math.max.apply(null, $.map($("body *"), function (ele, index) {
                if ($(ele).css("position") != "static") {
                    return parseInt($(ele).css('z-index')) || 1;
                } else {
                    return -1;
                }
            }))
            return max;
        }
    };

    let elementUtil = {
        getTimePickerHour() {
            return this.getTimePicker().find(`.${Prefix}time-picker-hour`);
        },
        getTimePickerMinute() {
            return this.getTimePicker().find(`.${Prefix}time-picker-minute`);
        },
        getTimePicker() {
            return $(`#${TimePickerID}`);
        }
    };

    let htmlUtil = {
        get() {
            let result = [];
            result.push(`<div id="${TimePickerID}" class="${Prefix}time-picker">`);
            result.push(this.header());
            result.push(this.body());
            result.push(this.footer());
            result.push(`</div>`);
            return result.join("");
        },
        header() {
            let result = [];
            result.push(`<div class="${Prefix}time-picker-header">`);
            result.push("<span>时</span>");
            result.push("<span>分</span>");
            result.push("</div>");
            return result.join("");
        },
        body() {
            let result = [];
            result.push(`<div class="${Prefix}time-picker-body">`);
            result.push(this.hour());
            result.push(this.minute());
            result.push("</div>");
            return result.join("");
        },
        footer() {
            let result = [];
            result.push(`<div class="${Prefix}time-picker-footer">`);
            result.push(this.button("取消", "cancel"));
            result.push(this.button("现在", "now"));
            result.push(this.button("确认", "ok"));
            result.push("</div>");
            return result.join("");
        },
        hour(activeNum) {
            let result = [];
            result.push(`<ul class="${Prefix}time-picker-hour">`);
            for (let i = 0; i < 24; i++) {
                if (i === activeNum) {
                    result.push(`<li class="active">${util.formatTime(i)}</li>`);
                } else {
                    result.push(`<li>${util.formatTime(i)}</li>`);
                }
            }
            result.push("</ul>");
            return result.join("");
        },
        minute(activeNum) {
            let result = [];
            result.push(`<ul class="${Prefix}time-picker-minute">`);
            for (let i = 0; i < 60; i++) {
                if (i === activeNum) {
                    result.push(`<li class="active">${util.formatTime(i)}</li>`);
                } else {
                    result.push(`<li>${util.formatTime(i)}</li>`);
                }
            }
            result.push("</ul>");
            return result.join("");
        },
        button(text, type) {
            return `<button class="${Prefix}time-picker-button ${type}" data-type="${type}">${text}</button>`;
        }
    };

    let eventUtil = {
        init() {
            let _this = this;

            $(window).resize(function () {
                if (IsShow) {
                    uiUtil.locationPosition();
                }
            });

            elementUtil.getTimePicker().find(`.${Prefix}time-picker-body`).hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });

            $(`#${TimePickerID} .${Prefix}time-picker-button`).click(function () {
                let type = $(this).data("type");
                _this[type] && _this[type].call(this);
            });

            $(`#${TimePickerID} .${Prefix}time-picker-body`).on("click", "li", function () {
                $(this).addClass("active").siblings().removeClass("active");
                uiUtil.scrollFixedPositionByElement(this, true);
            });
        },
        cancel() {
            closeTimePicker();
        },
        now() {
            $(CrtElement).val(util.getNowTime());
            closeTimePicker();
        },
        ok() {
            let _this = eventUtil;
            let hour = _this.getHour();
            let minute = _this.getMinute();
            $(CrtElement).val(`${hour}:${minute}`);
            closeTimePicker();
        },
        getHour() {
            let hour = $(`#${TimePickerID} .${Prefix}time-picker-hour li.active`);
            if (hour.length > 0) {
                return $(hour).html();
            } else {
                return "00";
            }
        },
        getMinute() {
            let minute = $(`#${TimePickerID} .${Prefix}time-picker-minute li.active`);
            if (minute.length > 0) {
                return $(minute).html();
            } else {
                return "00";
            }
        }
    };

    let util = {
        formatTime(value) {
            return ("0000" + value.toString()).slice(-2);
        },
        getNowTime() {
            let now = new Date();
            return `${this.formatTime(now.getHours())}:${this.formatTime(now.getMinutes())}`;
        }
    };


})(window, jQuery);
