#SGD Website Project

[![Build Status](https://travis-ci.org/yeastgenome/SGDFrontend.svg?branch=development)](https://travis-ci.org/yeastgenome/SGDFrontend)

This project is a frontend webaplication used for the SGD Nextgen Redesign. It retreives data in JSON format from
SGDBackend, then creates the pages of the website.

There is only one package in this project...

1. **sgdfrontend**

 This package contains the templates and code for the SGDNextGen site.
 
##Dependencies

###Python

* Pyramid
* Waitress
* simplejson
* requests


###Build Dependencies

There are a few development dependencies used to build assets, but not needed at runtime.  They are:

* [Node](http://nodejs.org/)
* [Grunt](http://gruntjs.com/)
* [Compass](http://compass-style.org/)

To install node:

    $ brew install node

Grunt:

    $ npm install -g grunt-cli

Compass:

    $ gem install compass -v 0.12.7

The build installs several node packages.  All of them are development, or build time dependencies.

For details, see files: package.json, Gruntfile.js, bower.json

###Deploying Production Assets

In production, assets are served from Amazon Cloudfront.  Before deploying to a production server, be sure to run 

    $ grunt deployAssets

and then commit changes to git.

This task requires the environmental variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY be set on the machine pushing the assets.  This will change a few files checked into git, so these changes must be committed.

##Building the app

To build the application:

    $ python bootstrap.py
    $ bin/buildout
    
To start the application:

    $ bin/pserve sgdfrontend_development.ini

To run off of a different backend:
Set the backend_url parameter in the config file to the URL of the new backend.

##Grunt

The buildout uses grunt to compile JavaScript and CSS assets from JSX and SASS, respectively.  In the buildout, the default grunt task runs all the necessary compilation, minification, and copying.  To run this rask separately, run:

    $ grunt

##Using the Development Task

In the production buildout, asset preparation tasks run from start to finish.  In development, however, there is an option to compile these assets, and then recompile them automatically when changes have been made.  To use this task, run:

    $ grunt dev

This will compile the JSX files and the SASS files in the client directory.  If you make any changes to these files while this task is running, they will automatically recompile.  Optionally, if you are using Chrome, you can install the [live reload plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en), which will reload the browser once the changed files have finished compiling.  Another difference between the development and production compile is that the bundled application.js file will be unminified with source maps, to help debug.  To stop this task, type `ctrl + c`.

##Browserify

The bundled application.js is compiled using [browserify](http://browserify.org/).  Future client dependencies should be installed with NPM, and required using the CommonJS style.

##JSX and React

Many of the files that compose the bundled application.js are [JSX](http://jsx.github.io/) files, compiled using the harmony option, which allows some ES6 features.  Future additions to the client/jsx directory should also have a .jsx extension.  JSX features are optional in a JSX file.  While using supported ES6 features is encouraged, it is possible to write plain JavaScript in a JSX file.

Some pages are written using the [react](http://facebook.github.io/react/) framework.  The react components are stored in the client/jsx/components directory, and future react components should follow.

##Testing

Selenium tests are written with [behave](http://pythonhosted.org/behave/).  With behave installed and the app running in development mode (see above), run:

    $ behave src/sgd/frontend/yeastgenome/tests/features

Tests are currently configured to use the selenium chrome driver.  If not installed, see [https://sites.google.com/a/chromium.org/chromedriver/getting-started](https://sites.google.com/a/chromium.org/chromedriver/getting-started).
