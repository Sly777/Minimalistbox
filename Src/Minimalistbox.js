/*
 * Minimalistbox
 * Created by : Ilker Guller
 * Website : http://www.ilkerguller.com
 * Github : https://github.com/Sly777/Minimalistbox
 * */
/* global jQuery,define */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    "use strict";

    var pluginName = "Minimalistbox",
        defaults = {
            placeholder: '',
            clear: false,
            onClear: null,
            onItemSelected: null,
            placeholderclass: 'placeholder'
        };

    function Plugin ( element, options ) {
        this.element = element;
        this.$el = $(this.element);
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.createHtml();
        },
        isInternetExplorer: function() {
            var rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                var ua = navigator.userAgent;
                var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                if (re.exec(ua) !== null)
                    rv = parseFloat( RegExp.$1 );
            }
            return rv;
        },
        createHtml: function() {
            var $el = $('<div></div>'),
                $Items = $('<div><ul></ul></div>'),
                $SelectedItem = $('<div><span></span></div>'),
                self = this;

            if(this.$el.attr("class")) {
                $el.addClass(this.$el.attr("class"));
            }

            this.$el.addClass(this._name + "-hiddenselect");

            $el.addClass(this._name + "-main");

            if(this.$el.attr("name")) {
                $el.addClass(this._name + "-" + this.$el.attr("name"));
            }

            if(this.$el.attr("id")) {
                $el.addClass(this._name + "-" + this.$el.attr("id"));
            }

            $Items.addClass(this._name + "-items");

            var $ul = $Items.find("ul");
            this.$el.find("option").each(function(){
                var $li = $('<li></li>');
                $li.addClass(self._name + "-item");
                $li.text($(this).text());
                $li.data("value", $(this).val());

                $ul.append($li);
            });

            $SelectedItem.addClass(this._name + "-result");

            if(this.settings.clear) {
                $SelectedItem.append('<i class="' + this._name + '-actionClear">X</i>');
            }

            $el.append($SelectedItem);
            $el.append($Items);

            this.$el.after($el);
            this.$el.appendTo($el);
            this.$parent = $el;

            this.changeSelectedItem();
            this.addEvents();
        },
        addEvents: function() {
            var self = this;

            this.$parent.on("click", "." + self._name + "-item", function() {
                self.onItemSelected($(this));
            });

            this.$parent.on("click", "." + self._name + "-result", function() {
                self.$parent.toggleClass(self._name + "-active");
            });

            if(this.settings.clear) {
                this.$parent.on("click", "." + self._name + "-actionClear", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    self.onClear();

                    if(self.settings.placeholder !== '') {
                        self.addPlaceHolder();
                    } else {
                        self.changeSelectedItem(self.$el.find('option:eq(0)').text());
                    }
                });
            }
        },
        addPlaceHolder: function() {
            var $SelectedItem = this.$parent.find("." + this._name + "-result");

            $SelectedItem
                .addClass(this.settings.placeholderclass)
                .find("span")
                .text(this.settings.placeholder);
        },
        onClear: function() {
            var $Items = this.$parent.find("." + this._name + "-items"),
                $select = this.$el;

            $select.find("option:selected").prop("selected", false);
            $Items.find("." + this._name + "-selected").removeClass(this._name + "-selected");
            $select.trigger("clear");

            if(this.settings.onItemSelected !== null && typeof this.settings.onClear === 'function') {
                this.settings.onClear();
            }
        },
        onItemSelected: function($Item) {
            var $Items = this.$parent.find("." + this._name + "-items"),
                $select = this.$el;

            $Items.find("." + this._name + "-selected").removeClass(this._name + "-selected");
            $Item.addClass(this._name + "-selected");
            $select.find("option[value='" + $Item.data("value") + "']").prop("selected", true);
            $select.trigger("change");
            this.changeSelectedItem($Item.text());
            this.$parent.toggleClass(this._name + "-active");

            if(this.settings.onItemSelected !== null && typeof this.settings.onItemSelected === 'function') {
                this.settings.onItemSelected($Item);
            }
        },
        changeSelectedItem: function(text) {
            var $select = this.$el;
            var $SelectedItem = this.$parent.find("." + this._name + "-result");

            if($SelectedItem.hasClass(this.settings.placeholderclass)) {
                $SelectedItem.removeClass(this.settings.placeholderclass);
            }

            if(text) {
                $SelectedItem.find("span").text(text);
            } else {
                if($select.find('option:selected').length > 0 && $select.find('option:selected').attr('selected')) {
                    $SelectedItem.find("span").text($select.find('option:selected').text());
                } else {
                    if(this.settings.placeholder !== '') {
                        this.addPlaceHolder();
                    } else {
                        $SelectedItem.find("span").text($select.find('option:eq(0)').text());
                    }
                }
            }
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };
});