(function () {
    var PLACEMENT = {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right",
    }

    var ALIGNMENT = {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right"
    }

    // auto-hide all droplets on click on the background
    document.addEventListener( "click", function ( ev ) {
        var droplet = parentSelector( ev.target, ".droplet" );
        if ( !droplet ) {
            hideAll()
        }
    })

    window.droplet = function () {

        var menu = document.createElement( "div" );
        menu.classList.add( "droplet" );
        menu.$ = {};
        menu.__droplet = droplet;

        var options = {}
        function droplet( target ) {

            if ( !droplet.visible() ) {
                requestAnimationFrame( function () {
                    droplet.show();
                    reposition();
                })
            }

            return this;

            function reposition () {
                if ( !droplet.visible() ) {
                    return
                }

                droplet.position( target );
                requestAnimationFrame( reposition );
            }
        }

        droplet.element = function () {
            menu.classList.add( "droplet-" + this.style() );
            return menu;
        }

        // droplet.el = getset( options, "el", menu );
        droplet.style = getset( options, "style", window.droplet.defaultStyle );
        droplet.placement = getset( options, "placement", PLACEMENT.BOTTOM );
        droplet.alignment = getset( options, "alignment", ALIGNMENT.LEFT );

        droplet.add = function () {
            var obj = { events: [] };
            // var items = this.items();
            var el = createItem()

            el.addEventListener( "mousemove", function () {
                if ( item.submenu ) {
                    item.submenu()( item.element() );
                } else {
                    hideAll( droplet );
                }
            })

            var item = {
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
            };

            this.element().appendChild( el );

            return item;
        }

        droplet.addDivider = function () {
            var item = this.add();
            var el = item.element();
            el.classList.remove( "droplet-item" );
            el.classList.add( "droplet-divider" );
            return {}
        }

        droplet.addFolder = function () {
            var item = this.add();
            var folder = document.createElement( "div" );
            folder.classList.add( "droplet-folder" );
            this.element().appendChild( folder );

            item.element = function () {
                return folder;
            }

            item.add = this.add.bind( item );
            item.addDivider = this.addDivider.bind( item );
            item.addFolder = this.addFolder.bind( item );

            // default caret icon
            var icon = document.createElement( "div" );
            icon.classList.add( "droplet-icon-caret" );
            icon.innerHTML = "&#9654;"
            item.icon( icon );

            // toggle behavior
            item.on( "click", function () {
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
            var submenu = window.droplet()
                .placement( PLACEMENT.RIGHT );
            item.add = submenu.add.bind( submenu );
            item.addDivider = submenu.addDivider.bind( submenu );
            item.addFolder = submenu.addFolder.bind( submenu );
            item.addMenu = submenu.addMenu.bind( submenu );
            item.submenu = function () { return submenu }
            submenu.parent = function () { return droplet };

            return item;
        }

        droplet.trigger = function ( trigger ) {
            trigger.addEventListener( "click", function () {
                if ( this.visible() ) {
                    return this.hide();
                }

                droplet( trigger );
            }.bind( this ) )
            return this;
        }

        droplet.position = function ( target ) {
            if ( !target || !target.parentNode ) {
                // target is no longer part of the DOM
                return;
            }

            var menu = this.element();
            var placement = this.placement();
            var alignment = this.alignment();

            var source = menu.getBoundingClientRect();
            var target = target.getBoundingClientRect();

            if ( placement == PLACEMENT.BOTTOM ) {
                menu.style.top = ( target.top + target.height ) + "px";
                if ( alignment == ALIGNMENT.RIGHT ) {
                    var deltaWidth = target.width - source.width;
                    menu.style.left = ( deltaWidth + target.left ) + "px";
                } else {
                    menu.style.left = target.left + "px";
                }
            } else if ( placement == PLACEMENT.RIGHT ) {
                var targetMid = target.top + ( target.height / 2 );
                menu.style.top = ( targetMid - ( source.height / 2 ) ) + "px";
                menu.style.left = ( target.left + target.width ) + "px"
            }

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

    function hideAll( except ) {
        var skip = [];
        while( except ) {
            skip.push( except );
            except = except.parent ? except.parent() : null;
        }

        var menus = document.querySelectorAll( ".droplet" );
        for ( var i = 0 ; i < menus.length ; i += 1 ) {
            if ( skip.indexOf( menus[ i ].__droplet ) == -1 ) {
                menus[ i ].__droplet.hide();
            }
        }
    }

    window.droplet.styles = {
        Standard: "",
        Dark: "dark",
    }
    window.droplet.defaultStyle = "Standard";

    window.droplet.PLACEMENT = PLACEMENT;
    window.droplet.ALIGNMENT = ALIGNMENT;

    function getset ( obj, key, default_ )  {
        return function ( v ) {
            if ( !arguments.length ) {
                return obj[ key ] || default_;
            }
            obj[ key ] = v;
            return this;
        }
    }

    function parentSelector( el, selector ) {
        while ( el && el.matches ) {
            if ( el.matches( selector ) ) {
                return el;
            }
            el = el.parentNode;
        }
    }

})()