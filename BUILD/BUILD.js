var sys = require('sys')
   , fs = require('fs')
   , M = require('./Mustache');
   
   


var code = '';
var docs = {};

docs.main = '';
docs.API = '';

// read in the the main.js file as our main boilerplate code 
code += fs.readFileSync('./main.js', encoding='utf8');
docs.main += fs.readFileSync('./docs.js', encoding='utf8');

// parse entire lib directory and concat it into one file for the browser
var lib = paths('./lib');


var Faker= require('../index');


docs.API += '<ul>';
for(var module in Faker){
  docs.API += '<li>' + module;
    docs.API += '<ul>'
    for(var method in Faker[module]){
      docs.API += '<li>' + method + '</li>';
    }
    docs.API += '</ul>';
  docs.API += '</li>';
}
docs.API += '</ul>';


// generate some samples sets (move this code to another section)
fs.writeFile('../Faker.js', code, function() {
  sys.puts("Faker.js generated successfully!");
});




var docOutput = M.Mustache.to_html(docs.main, {"API":docs.API});


// generate some samples sets (move this code to another section)
fs.writeFile('../Readme.md', docOutput, function() {
  sys.puts("Docs generated successfully!");
});


/*********************** BUILD HELPER METHODS *********************/

  // Recursively traverse a hierarchy, returning a list of all relevant .js files.
  function paths(dir) {
      var paths = [];

      try { fs.statSync(dir) }
      catch (e) { return e }

      (function traverse(dir, stack) {
          stack.push(dir);
          fs.readdirSync(stack.join('/')).forEach(function (file) {
              var path = stack.concat([file]).join('/'),
                  stat = fs.statSync(path);

              if (file[0] == '.' || file === 'vendor') {
                  return;
              } else if (stat.isFile() && /\.js$/.test(file)) {
                  paths.push(path);
              } else if (stat.isDirectory()) {
                  paths.push(path);
                  traverse(file, stack);
              }
          });
          stack.pop();
      })(dir || '.', []);

      return paths;
  }
