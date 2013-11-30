/*
 * Minimalistbox - V.0.1
 * Created by : Ilker Guller
 * Website : http://www.ilkerguller.com
 * Github : https://github.com/Sly777/Minimalistbox
 * */

 (function ($, undefined) {
    var pluginName = "Minimalistbox",
        defaults = {
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
                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
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
        },
        onItemSelected: function($Item) {
            var $Items = this.$parent.find("." + this._name + "-items"),
                $select = this.$el;

            $Items.find("." + this._name + "-selected").removeClass(this._name + "-selected");
            $Item.addClass(this._name + "-selected");
            $select.find("option[value='" + $Item.data("value") + "']").prop("selected", true);
            this.changeSelectedItem($Item.text());
            this.$parent.toggleClass(this._name + "-active");
        },
        changeSelectedItem: function(text) {
            var $select = this.$el;
            var $SelectedItem = this.$parent.find("." + this._name + "-result");

            if(text) {
                $SelectedItem.find("span").text(text);
            } else {
                if($select.find('option:selected').length > 0) {
                    $SelectedItem.find("span").text($select.find('option:selected').text());
                } else {
                    $SelectedItem.find("span").text($select.find('option:eq(0)').text());
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
})( jQuery );