(function () {
    var glass = window.glass;

    var menu = glass()
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
        .trigger( document.querySelector( "#settings" ) );
    menu.add()
        .title( "My Account" );
    menu.add()
        .title( "Billing Settings" )
    menu.add()
        .title( "Notifications" )
    
})()