<?php

    require 'vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem('my_events_templates');
    $twig = new Twig_Environment($loader);

    echo $twig -> render('views/events_index.twig'); 

?>