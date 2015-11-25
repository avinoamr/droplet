(function () {
    var glass = window.glass;
    var STYLE = glass.styles.Dark;

    var menu = glass()
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

    var menu = glass()
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

    var menu = glass()
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

    var menu = glass()
        .style( STYLE )
        .trigger( document.querySelector( "#settings" ) );
    menu.add()
        .title( "My Account" );
    menu.add()
        .title( "Billing Settings" )
    menu.add()
        .title( "Notifications" )
    
})()