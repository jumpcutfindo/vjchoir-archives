# The VJChoir Archives repository

Hello, welcome to the repository of the archives. The archives are a simple, frontend only website that provides different pages for the display of the choir's history, as well as an in-built player for the playing of music from the choir's old performances. This website uses Angular 14 alongside TypeScript and SCSS for styling. 

## Setup process
1. Run the following code to set up:
```
npm install
```

2. Run the following to create a client on localhost (development environment):
```
npm start
```

## Build process
1. Do coding here
2. Build using the following command:
   ```
   ng build --configuration production --base-href="https://vjchoir.github.io/"
   ```
3. Copy paste production (under /vjchoir-archives/dist) into vjchoir.github.io repo and let it be deployed by GitHub Pages automatically. Note that you need to include the following lines of code in the "index.html" file because GitHub Pages is kinda funky and without it, it won't properly handle direct links. You also need a dummy 404.html file for this (should be in the repository already).
```
<script>
      (function() {
        var redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect != location.href) {
          history.replaceState(null, null, redirect);
        }
      })();
</script>
```
4. Publish
