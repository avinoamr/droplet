(function () {
    window.glass.styles.Mini = function ( items ) {
        var el = document.createElement( "div" );
        el.classList.add( "glass-mini" );
        
        var hasIcons = items.some( function ( item ) {
            return !!item.icon()
        })

        items.map( function ( item ) {
            var div = document.createElement( "div" );
            div.classList.add( "item" );

            if ( item.divider() ) {
                div.classList.add( "glass-divider" )
            }

            var html = [];

            if ( hasIcons ) {
                var icon = item.icon() || "fa fa-circle-o";
                html.push( "<i class='icon " + icon + "'></i>" );
            }

            var title = [];

            if ( item.title() ) {
                title.push( "<div class='maintitle'>" + item.title() + "</div>" )
            }
            if ( item.subtitle() ) {
                title.push( "<div class='subtitle'>" + item.subtitle() + "</div>" )
            }

            html.push( "<div class='title'>" + title.join( "" ) + "</div>" )

            div.innerHTML = html.join( "" );
            el.appendChild( div );
        })

        return el;
    }
})()