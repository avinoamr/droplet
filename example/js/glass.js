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
            var style = this.style();

            var items = this.items();
            var el = document.createElement( "div" );
            el.classList.add( "glass-" + style );

            items.forEach( function ( item ) {
                el.appendChild( item.element() );
            })

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
            return !!getIcon( item );
        })

        var el = document.createElement( "div" );
        if ( this.divider() ) {
            el.classList.add( "glass-divider" );
            return el;
        }

        el.classList.add( "glass-item" );

        if ( hasIcons ) {
            var icon = document.createElement( "div" );
            icon.setAttribute( "class", "glass-icon " + getIcon( this ) );
            icon.innerHTML = getIcon( this ).html || "";
            el.appendChild( icon );
        }

        var content = document.createElement( "glass-content" );

        if ( this.title() ) {
            var maintitle = document.createElement( "div" );
            maintitle.classList.add( "glass-maintitle" );
            maintitle.innerHTML = this.title();
            content.appendChild( maintitle );
        }
        if ( this.subtitle() ) {
            var subtitle = document.createElement( "div" );
            subtitle.classList.add( "glass-subtitle" );
            subtitle.innerHTML = this.subtitle();
            content.appendChild( subtitle );
        }

        el.appendChild( content );

        if ( this.folder ) {
            var folder = document.createElement( "div" );
            folder.classList.add( "glass-folder" );
            this.folder().forEach( function ( item ) {
                folder.appendChild( item.element() );
            })

            el.addEventListener( "click", function () {
                folder.classList.toggle( "glass-folder-open" );
            })

            var el_ = document.createElement( "div" );
            el_.appendChild( el );
            el_.appendChild( folder );
            el = el_;
        }

        return el;
    }

    window.glass.defaultStyle = ""; 
    //carl-fredricksen";


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