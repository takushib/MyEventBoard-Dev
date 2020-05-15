# MyEventBoard

MyEventBoard is a scheduling web application currently being developed by Tommy Liao, Simon Louie and Blaise Takushi,  
as part of the Schedule It! project.

## Accessing the Application

While MyEventBoard is currently in development, it can be accessed at:  
http://web.engr.oregonstate.edu/~liaoto/MyEventBoard/  
http://web.engr.oregonstate.edu/~louiesi/MyEventBoard/  
http://web.engr.oregonstate.edu/~takushib/MyEventBoard/  

## Setting Up the Repository for Development

For the project to be functional, it should be cloned into the 'public_html' folder in your engineering filespace.  
MyEventBoard in its current state is supposed to run only on the engineering servers, as requested by the client.  

There are a few things to install. Run the Bash shell commands below to install Composer and some packages.  
MyEventBoard uses Twig, Mimey, and phpCAS. Install Composer first, and then install the packages.

`bash install_composer.sh`
`bash install_packages.sh`

Remember to also set permissions for everything inside the repository.  
Run the script named 'set_permissions.sh'.

## Resources for Development

Composer is a dependency manager for PHP. Visit https://getcomposer.org/ for more information.

Twig is a templating engine for PHP. Documentation is available at https://twig.symfony.com/doc/1.x/  

phpCAS is an official client for CAS, the single sign-on system used by Oregon State University.  
Go to https://github.com/apereo/phpCAS/tree/master/docs/examples for example code.  
For documentation on the source code, it can be found at https://apereo.github.io/phpCAS/api/

Mimey is a package that MyEventBoard uses for its file upload functionality.  
Read more about it at https://github.com/ralouphie/mimey



