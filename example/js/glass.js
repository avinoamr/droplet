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
                title: getset( obj, "title", "" ),
                subtitle: getset( obj, "subtitle", "" ),
                icon: getset( obj, "icon", "" ),
                helper: getset( obj, "helper", "" ),
                divider: getset( obj, "divider", false ),
                element: buildElement,
                menu: function () { return glass },
            })

            return items[ items.length - 1 ];
        }

        glass.addFolder = function () {
            var obj = {};
            var item = this.add();
            item.items = getset( obj, "items", [] )
            item.folder = item.items;
            item.add = this.add.bind( item );
            
            // default caret icon
            var icon = document.createElement( "div" );
            icon.classList.add( "glass-icon-caret" );
            icon.innerHTML = "&#9654;"
            item.icon = getset( obj, "icon", icon );

            return item;
        }

        glass.addMenu = function () {
            var obj = {};
            var item = this.add();
            item.submenu = getset( obj, "submenu", window.glass() );
            item.add = item.submenu().add.bind( item.submenu() );
            item.addFolder = item.submenu().addFolder.bind( item.submenu() )
            item.addMenu = item.submenu().addMenu.bind( item.submenu() )

            // default caret helper
            var helper = document.createElement( "div" );
            helper.classList.add( "glass-icon-caret" );
            helper.innerHTML = "&#9654;"
            item.helper = getset( obj, "helper", helper );
            return item;
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
            var items = this.items();
            var el = document.createElement( "div" );
            el.classList.add( "glass-inner" );

            items.forEach( function ( item ) {
                el.appendChild( item.element() );
            })

            var style = this.style();

            if ( typeof style == "function" ) {
                style = style( this, el );
            }
            el.classList.add( "glass-" + style );

            var menu = this.el();
            menu.innerHTML = "";
            menu.appendChild( el );
            return this;
        }


        return glass;
    }

    function getIcon( item ) {
        var icon = item.icon();

        if ( !icon && item.folder ) {
            icon = new String( "glass-icon-caret" );
            icon.html = "&#9654;"
        }

        return icon;
    }

    function buildElement() {
        var items = this.menu().items();
        var hasIcons = items.some( function ( item ) {
            return !!item.icon();
        })

        var el = document.createElement( "div" );
        if ( this.divider() ) {
            el.classList.add( "glass-divider" );
            return el;
        }

        el.classList.add( "glass-item" );

        if ( hasIcons ) {
            var icon = this.icon();
            if ( !( icon instanceof Element ) ) {
                icon = document.createElement( "div" );;
                icon.setAttribute( "class", this.icon() );
            }
            icon.classList.add( "glass-icon" );
            el.appendChild( icon );
        }

        var content = document.createElement( "div" );
        content.classList.add( "glass-content" )

        if ( this.title() ) {
            var maintitle = this.title();
            if ( !( maintitle instanceof Element ) ) {
                maintitle = document.createElement( "div" );
                maintitle.innerHTML = this.title();
            }
            maintitle.classList.add( "glass-maintitle" );
            content.appendChild( maintitle );
        }
        if ( this.subtitle() ) {
            var subtitle = this.subtitle();
            if ( !( subtitle instanceof Element ) ) {
                var subtitle = document.createElement( "div" );
                subtitle.innerHTML = this.subtitle();
            }
            subtitle.classList.add( "glass-subtitle" );
            content.appendChild( subtitle );
        }

        el.appendChild( content );

        if ( this.helper() ) {
            var helper = this.helper();
            if ( !( helper instanceof Element ) ) {
                helper = document.createElement( "div" );
                helper.innerHTML = this.helper();
            }
            helper.classList.add( "glass-helper" );
            el.appendChild( helper );
        }

        if ( this.folder ) {
            var folder = document.createElement( "div" );
            folder.classList.add( "glass-folder" );
            this.folder().forEach( function ( item ) {
                folder.appendChild( item.element() );
            })

            el.addEventListener( "click", function () {
                icon.classList.toggle( "glass-open" )
                folder.classList.toggle( "glass-open" );

                // we can't animate the height via CSS (only the max-height, but 
                // it creates visual artifacts), so we have to compute it.
                var isOpen = folder.classList.contains( "glass-open" )

                if ( !isOpen ) {
                    folder.style.height = "";
                } else {
                    var h = [].slice.call( folder.children )
                        .reduce( function ( h, child ) {
                            return h + child.getBoundingClientRect().height;
                        }, 0 )
                    folder.style.height = h + "px";
                }
            })

            var el_ = document.createElement( "div" );
            el_.appendChild( el );
            el_.appendChild( folder );
            el = el_;
        }

        return el;
    }

    window.glass.defaultStyle = "";

    window.glass.styles = {
        Mini: "mini",
        CarlFredricksen: function ( that, el ) {

            // var canvas = document.createElement( "canvas" );
            // canvas.classList.add( "glass-carl-fredricksen-canvasbg" );
            // el.appendChild( canvas );

            return "carl-fredricksen";

            function render() {
                
            }
        }
    }

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