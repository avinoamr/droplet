(function () {
    var components = {};
    window.droplet = function () {

        var menu = document.createElement( "div" );
        menu.classList.add( "droplet" );
        document.body.appendChild( menu );

        var options = {}
        function droplet() {}
        droplet.el = getset( options, "el", menu );
        droplet.style = getset( options, "style", window.droplet.defaultStyle );
        droplet.items = getset( options, "items", [] );

        droplet.add = function () {
            var obj = { events: [] };
            var items = this.items();

            items.push({
                title: getset( obj, "title", "" ),
                subtitle: getset( obj, "subtitle", "" ),
                icon: getset( obj, "icon", "" ),
                helper: getset( obj, "helper", "" ),
                divider: getset( obj, "divider", false ),
                events: getset( obj, "events", [] ),
                element: buildElement,
                on: function ( type, listener ) {
                    this.events().push({ type: type, listener: listener });
                    return this;
                },
                menu: function () { return droplet },
            })

            return items[ items.length - 1 ];
        }

        droplet.addFolder = function () {
            var obj = {};
            var item = this.add();
            item.items = getset( obj, "items", [] )
            item.folder = item.items;
            item.add = this.add.bind( item );
            
            // default caret icon
            var icon = document.createElement( "div" );
            icon.classList.add( "droplet-icon-caret" );
            icon.innerHTML = "&#9654;"
            item.icon = getset( obj, "icon", icon );

            return item;
        }

        droplet.addMenu = function () {
            var obj = {};
            var item = this.add();
            item.submenu = getset( obj, "submenu", window.droplet() );
            item.add = item.submenu().add.bind( item.submenu() );
            item.addFolder = item.submenu().addFolder.bind( item.submenu() )
            item.addMenu = item.submenu().addMenu.bind( item.submenu() )

            // default caret helper
            var helper = document.createElement( "div" );
            helper.classList.add( "droplet-icon-caret" );
            helper.innerHTML = "&#9654;"
            item.helper = getset( obj, "helper", helper );
            return item;
        }

        droplet.trigger = function ( trigger ) {
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

        droplet.position = function ( element ) {
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

        droplet.visible = function () {
            return menu.style.display == "block";
        }

        droplet.show = function () {
            menu.style.display = "block";
            return this;
        }

        droplet.hide = function () {
            menu.style.display = "";
            return this;
        }

        droplet.create = function () {
            var items = this.items();
            var el = document.createElement( "div" );
            el.classList.add( "droplet-inner" );

            items.forEach( function ( item ) {
                el.appendChild( item.element() );
            })

            var style = this.style();

            if ( typeof style == "function" ) {
                style = style( this, el );
            }
            el.classList.add( "droplet-" + style );

            var menu = this.el();
            menu.innerHTML = "";
            menu.appendChild( el );
            return this;
        }


        return droplet;
    }

    function getIcon( item ) {
        var icon = item.icon();

        if ( !icon && item.folder ) {
            icon = new String( "droplet-icon-caret" );
            icon.html = "&#9654;"
        }

        return icon;
    }

    function buildElement() {
        var items = this.menu().items();
        var hasIcons = items.some( function ( item ) {
            return !!item.icon();
        })

        var el = this._el = document.createElement( "div" );
        this.events().forEach( function ( event ) {
            el.addEventListener( event.type, event.listener );
        })

        if ( this.divider() ) {
            el.classList.add( "droplet-divider" );
            return el;
        }

        el.classList.add( "droplet-item" );

        if ( hasIcons ) {
            var icon = this.icon();
            if ( !( icon instanceof Element ) ) {
                icon = document.createElement( "div" );;
                icon.setAttribute( "class", this.icon() );
            }
            icon.classList.add( "droplet-icon" );
            el.appendChild( icon );
        }

        var content = document.createElement( "div" );
        content.classList.add( "droplet-content" )

        if ( this.title() ) {
            var maintitle = this.title();
            if ( !( maintitle instanceof Element ) ) {
                maintitle = document.createElement( "div" );
                maintitle.innerHTML = this.title();
            }
            maintitle.classList.add( "droplet-maintitle" );
            content.appendChild( maintitle );
        }
        if ( this.subtitle() ) {
            var subtitle = this.subtitle();
            if ( !( subtitle instanceof Element ) ) {
                var subtitle = document.createElement( "div" );
                subtitle.innerHTML = this.subtitle();
            }
            subtitle.classList.add( "droplet-subtitle" );
            content.appendChild( subtitle );
        }

        el.appendChild( content );

        if ( this.helper() ) {
            var helper = this.helper();
            if ( !( helper instanceof Element ) ) {
                helper = document.createElement( "div" );
                helper.innerHTML = this.helper();
            }
            helper.classList.add( "droplet-helper" );
            el.appendChild( helper );
        }

        if ( this.folder ) {
            var folder = document.createElement( "div" );
            folder.classList.add( "droplet-folder" );
            this.folder().forEach( function ( item ) {
                folder.appendChild( item.element() );
            })

            el.addEventListener( "click", function () {
                icon.classList.toggle( "droplet-open" )
                folder.classList.toggle( "droplet-open" );

                // we can't animate the height via CSS (only the max-height, but 
                // it creates visual artifacts), so we have to compute it.
                var isOpen = folder.classList.contains( "droplet-open" )

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

    window.droplet.styles = {
        Standard: "",
        Dark: "dark",
    }
    window.droplet.defaultStyle = "Standard";

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