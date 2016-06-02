## Migrating from shep 0.X to shep 1.0

- Shep 1.0 only supports node 4.3. Make sure all functions are using the `callback` style instead of the old `context.done()` methods
- Remove `node_modules` and `package.json` from individual function folders. Shep 1.0 installs all the modules at the project level and then uses webpack to ensure only nessecary modules are included in your build.
- Add a `lambda.json` file to your root directory. This will be the default lambda settings for every function. They will be overridden by anything in each functions `lambda.json` file
- Each function folder should have it's own `lambda.json file`. You will need to add this following:

```
{
  "FunctionName": "$PROJECT_NAME-$FUNCTION_NAME"
}
```

This is the name of the function that will be created/updated on Lambda.


- Remove all symlinks and instead reference the file directly. Webpack will handle bundling these files for you.
- Add `dist/*` to .gitignore
- Change all files in `config/` from `.json` to `.js`
- Run `shep pull`. This will pull down a swagger representation of the latest deployed API for your project. This will now be imported/exported to manage changes with API Gateway.
- Add a webpack.config.js file to the project root.
