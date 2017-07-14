# Slides+Handlebars+SASS

### Start a new site
To start a new site, clone the repo, install dependencies

```
$ git clone git@github.com:TechMex-io/hbs.git name-of-your-directors
$ cd name-of-your-directors/
$ npm install
```

### Gulp Tasks

`gulp build` Run the build task before you begin working on a site. This will ensure you have all the assets, js, css and html files in your `dist` folder.

`gulp` This is the default gulp task that will launch the site and show your changes with live reload.

`gulp deploy --dev` This task will deploy the site to a `gh-pages` on your github repo branch and make the site available for view. As an example, you can view this repo's site at https://techmex-io.github.io/hbs/

`gulp deploy --prod user@hostname:/path/to/www` This task takes a second parameter, `user@hostname:/path/to/www` to connect to ftp via ssh. You will need your ssh username and the path to the directory where you want the site hosted. You will be asked to type in your password.
