<?php

    // set up twig

    include 'php/twig.php';

    // set up connection to database via MySQLi

    include 'php/database.php';

    // set up CAS client
    
    include 'php/cas.php';

    // render page using twig

    echo $twig -> render('views/main.twig');

?>
