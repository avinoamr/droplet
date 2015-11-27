(function () {
    var droplet = window.droplet;
    var STYLE = droplet.styles.Standard;

    var menu = droplet()
        .style( STYLE )
        .trigger( document.querySelector( "#style" ) );

    var standard = menu.add()
        .title( "Standard" )
        .icon( "fa fa-check" )
        .on( "click", function () {
            standard.icon( "fa fa-check" );
            dark.icon( null );
        })
    var dark = menu.add()
        .title( "Dark" )
        .on( "click", function () {
            standard.icon( null );
            dark.icon( "fa fa-check" );
        })

    var menu = droplet()
        .style( STYLE )
        .trigger( document.querySelector( "#example" ) );
    menu.add()
        .title( "New" )
        .helper( "Ctrl+N" );
    menu.add()
        .title( "Open..." )
        .helper( "Ctrl+O" )
        .icon( "fa fa-folder-open" );
    menu.add()
        .title( "Save..." )
        .icon( "fa fa-file-text" );
    menu.add()
        .divider( true );

    var folder = menu.addFolder()
        .title( "Folder" );
    folder.add()
        .title( "Copy" );
    folder.add()
        .title( "Paste" );

    var submenu = menu.addMenu()
        .title( "Submenu" );

    var menu = droplet()
        .style( STYLE )
        .trigger( document.querySelector( "#docs" ) );
    menu.add()
        .title( "Install" )
        .subtitle( "With bower" )
    menu.add()
        .title( "Items" )
        .subtitle( "Build your menus" )
    menu.add()
        .title( "Styles" )
        .subtitle( "Choose or roll your own" )
    menu.add()
        .title( "Controls" )

    var menu = droplet()
        .style( STYLE )
        .trigger( document.querySelector( "#source-code" ) );
    menu.add()
        .title( "Github" )
        .icon( "fa fa-github" );
    menu.add()
        .title( "Download" )
        .icon( "fa fa-download" )
    menu.add()
        .title( "Browse" )
        .icon( "fa fa-book" )
    
})()