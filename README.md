## Installing on local machine

### Please make sure you have node.js installed on your machine

If you don't have, [click here](https://nodejs.org/)

#### 1. Check if you have it installed or not,

```
npm -v
```

and,

```
node -v
```

you should see some version info in return.

#### 2. Install global packages

run on any directory,

```
npm install --global gulp-cli
```

#### 3. Now go to the directory where you want to place the project files using git bash

run the command,

```
git clone URL
```

here URL is the http url you get from the repository page, [Click here to clone](https://github.com/mkwiecien00/country-app)

#### 4. Now navigate to the project directory with cmd (terminal for mac or linux)</b><br>

run the command,

```
npm install
```

wait for it to be completed.
It will download all the dependencies, build the project and serve the build on browser.

## Using the gulp commands

#### 1. Serve the source

File watching enabled (Development Mode)

```
gulp
```

You should see the browser window opening address http://localhost:3000 (opens another port if unavailable).

#### 2. Get the dist folder cleaned

```
gulp cleanStuff
```

Warning: It will delete all the folder dist, in order to have it updated, type gulp in terminal again !!!

## Developer Hint

In order to exit Gulp watch

#### Press: ctrl + c
