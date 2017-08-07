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

`gulp deploy --prod` This task connects to ftp via ssh. You will need your ssh username and the path to the directory where you want the site hosted in a `.env` file. You will be prompted for your password via the cli.

`gulp deploy --ftp` This task connects via ftp and transmits files to the host. Username, password and host must be saved in `.env` file. **Note** This process will take longer than the ssh method above.

`gulp deploy --surge`Make sure you have added the domain name under the `domain` property under the `surge` gulp task. Once done, run this gulp task to deploy.


### Dev
To deploy and test your site in dev:
* make sure to checkout a `dev` branch
* make sure the `dev` branch is updated with the latest `master` branch. You can do this by checking out `dev` and running the following commands:
```
$ git fetch
$ git rebase master
```
* Change the `baseurl` property in the gulpfile to the base url of the Tech-Mex repo in which you are working. (e.g. https://techmex-io.github.io/REPO-NAME-HERE)
* Next, merge your feature branch into `dev` to make sure there are no conflicts or issues pushing your changes into master:
```
$ git merge your-feature-branch
```
* Commit your changes and push to `dev`
* Run the dev deploy command: `gulp deploy --dev`


### Templates
Create a template, e.g. one-column.hbs, blog-post.hbs, etc., in the `views/templates` directory. All partials work in the template files.

When you want to create a new page, run `gulp page --name-of-template name-of-page` and that will create a page based off your template ready for content. For example, you can run
```
$ gulp page --blog-post blog/my-first-post
```
This will use the `blog-post.hbs` template file inside the `templates` directory and create a new file named `my-first-post.html` inside the `blog` directory based off the template file. Note that if you want to create a file inside a directory, the directory needs to exist. Otherwise, it will result in error. To create a new directory, you can either create one with you text editor or run `gulp dir --name-of-dir`. You can also create subdirectories this way. The same rule applies for existing directories.


