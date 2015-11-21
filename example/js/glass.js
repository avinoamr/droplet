(function () {
    var components = {};
    window.glass = function () {

        var menu = document.createElement( "div" );
        menu.classList.add( "glass" );
        document.body.appendChild( menu );

        var options = {}
        function glass() {}
        glass.el = getset( options, "el", menu );
        glass.style = getset( options, "style", window.glass.defaultStyle );
        glass.items = getset( options, "items", [] );

        glass.add = function () {
            var obj = {};
            var items = this.items();
            items.push({
                title: getset( obj, "title" ),
                subtitle: getset( obj, "subtitle" ),
                icon: getset( obj, "icon" ),
                divider: getset( obj, "divider", false ),
            })

            return items[ items.length - 1 ];
        }

        glass.trigger = function ( trigger ) {
            trigger.addEventListener( "click", function () {
                if ( this.visible() ) {
                    return this.hide();
                }
                this.create()
                    .show()
                    .position( trigger );
            }.bind( this ) )
            return this;
        }

        glass.position = function ( element ) {
            var menu = this.el();

            var rect = element.getBoundingClientRect();

            menu.style.left = rect.left + "px";
            menu.style.top = ( rect.top + rect.height ) + "px";

            // if ( rect.left > document.body.offsetWidth / 2 ) {
            //     var dwidth = menu.getBoundingClientRect().width - rect.width;
            //     menu.style.left = ( parseInt( menu.style.left ) - dwidth ) + "px";
            // }


            return this;
        }

        glass.visible = function () {
            return menu.style.display == "block";
        }

        glass.show = function () {
            menu.style.display = "block";
            return this;
        }

        glass.hide = function () {
            menu.style.display = "";
            return this;
        }

        glass.create = function () {
            var style = this.style();
            var stylefn = window.glass.styles[ style ];
            var el = stylefn( this.items() );

            var menu = this.el();
            menu.innerHTML = "";
            menu.appendChild( el );
            return this;
        }


        return glass;
    }

    window.glass.defaultStyle = "Mini";
    window.glass.styles = {}


    function getset ( obj, key, default_ )  {
        return function ( v ) {
            if ( !arguments.length ) {
                return obj[ key ] || default_;
            }
            obj[ key ] = v;
            return this;
        }
    }

})()