(function () {
    var glass = window.glass;

    // style selection
    

    var menu = glass()
        .trigger( document.querySelector( "#menu" ) );
    menu.add()
        .title( "My Account" );
    menu.add()
        .title( "Billing Settings" )
    menu.add()
        .title( "Notifications" )
    
})()