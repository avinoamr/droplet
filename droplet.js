(function () {
    var components = {};
    window.droplet = function () {

        var menu = document.createElement( "div" );
        menu.classList.add( "droplet" );
        menu.$ = {};

        var options = {}
        function droplet() { this.show() }
        droplet.element = function () {
            menu.innerHTML = "";
            this.items().forEach( function ( item ) {
                menu.appendChild( item.element() );
            });
            menu.classList.add( "droplet-" + this.style() );
            return menu;
        }

        // droplet.el = getset( options, "el", menu );
        droplet.style = getset( options, "style", window.droplet.defaultStyle );
        droplet.items = getset( options, "items", [] );

        droplet.add = function () {
            var obj = { events: [] };
            var items = this.items();
            var el = createItem()

            items.push({
                title: function ( v ) {
                    if ( !arguments.length ) {
                        return el.$.maintitle.innerHTML;
                    }
                    el.$.maintitle.innerHTML = v;
                    return this;
                },
                subtitle: function ( v ) {
                    if ( !arguments.length ) {
                        return el.$.subtitle.innerHTML;
                    }
                    el.$.subtitle.innerHTML = v;
                    return this;
                },
                icon: function ( v ) {
                    if ( !arguments.length ) {
                        return el.$.icon.getAttribute( "class" )
                            .replace( "droplet-icon ", "" );
                    }

                    el.$.icon.innerHTML = "";
                    if ( v instanceof Element ) {
                        el.$.icon.appendChild( v );
                    } else {
                        el.$.icon.setAttribute( "class", "droplet-icon " + v );
                    }
                    
                    return this;
                },
                helper: function ( v ) {
                    if ( !arguments.length ) {
                        return el.$.helper.innerHTML;
                    }

                    el.$.helper.innerHTML = "";
                    if ( v instanceof Element ) {
                        el.$.helper.appendChild( v );
                    } else {
                        el.$.helper.innerHTML = v;
                    }
                    return this;
                },
                element: function () {
                    return el;
                },
                on: function ( type, listener ) {
                    el.addEventListener( type, listener );
                    return this;
                },
                menu: function () { return droplet },
            })

            return items[ items.length - 1 ];
        }

        droplet.addDivider = function () {
            var item = this.add();
            var el = item.element();
            el.classList.remove( "droplet-item" );
            el.classList.add( "droplet-divider" );
            return {}
        }

        droplet.addFolder = function () {
            var obj = {};
            var item = this.add();

            var icon = item.element().$.icon;

            var el = document.createElement( "div" );
            el.appendChild( item.element() );
            el.$ = {};

            el.$.folder = document.createElement( "div" );
            el.$.folder.classList.add( "droplet-folder" );
            el.appendChild( el.$.folder );

            item.items = getset( obj, "items", [] );
            item.add = this.add.bind( item );
            item.addDivider = this.addDivider.bind( item );
            
            // default caret icon
            var icon = document.createElement( "div" );
            icon.classList.add( "droplet-icon-caret" );
            icon.innerHTML = "&#9654;"
            item.icon( icon );

            item.element = function () {
                el.$.folder.innerHTML = "";
                this.items().forEach( function ( item ) {
                    el.$.folder.appendChild( item.element() );
                })
                return el;
            }

            item.on( "click", function () {
                var folder = el.$.folder;

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

            return item;
        }

        droplet.addMenu = function () {
            var obj = {};
            var item = this.add();

            // default caret helper
            var helper = document.createElement( "div" );
            helper.classList.add( "droplet-icon-caret" );
            helper.innerHTML = "&#9654;"
            item.helper( helper );

            // submenu
            var submenu = window.droplet().trigger( item.element() );
            item.add = submenu.add.bind( submenu );
            item.addDivider = submenu.addDivider.bind( submenu );
            item.addFolder = submenu.addFolder.bind( submenu );
            item.addMenu = submenu.addMenu.bind( submenu );

            return item;
        }

        droplet.trigger = function ( trigger ) {
            trigger.addEventListener( "click", function () {
                if ( this.visible() ) {
                    return this.hide();
                }
                this.show()
                    .position( trigger );
            }.bind( this ) )
            return this;
        }

        droplet.position = function ( element ) {
            var menu = this.element();

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
            var element = this.element();
            if ( !element.parentNode ) {
                document.body.appendChild( element );
            }
            element.style.display = "block";
            return this;
        }

        droplet.hide = function () {
            this.element().style.display = "";
            return this;
        }

        return droplet;
    }

    function createItem() {
        var el = document.createElement( "div" );
        el.classList.add( "droplet-item" );
        el.$ = {};

        el.$.icon = document.createElement( "div" );
        el.$.icon.classList.add( "droplet-icon" );
        el.appendChild( el.$.icon );

        el.$.content = document.createElement( "div" );
        el.$.content.classList.add( "droplet-content" );
        el.appendChild( el.$.content );

        el.$.maintitle = document.createElement( "div" );
        el.$.maintitle.classList.add( "droplet-maintitle" );
        el.$.content.appendChild( el.$.maintitle );

        el.$.subtitle = document.createElement( "div" );
        el.$.subtitle.classList.add( "droplet-subtitle" );
        el.$.content.appendChild( el.$.subtitle );

        el.$.helper = document.createElement( "div" );
        el.$.helper.classList.add( "droplet-helper" );
        el.appendChild( el.$.helper );

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