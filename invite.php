<?php

    require 'vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem('my_invites_templates');
    $twig = new Twig_Environment($loader);

    echo $twig -> render('views/invites_index.twig'); 

?>