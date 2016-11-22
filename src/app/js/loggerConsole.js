module.exports = (function(window, document){

   document.body.innerHTML = document.body.innerHTML + '<div id="log-box" '
       + ' style="position: absolute; bottom: 0; left: 0; right: 0; height: auto; color:white; '
       + ' border:2px solid red; background:rgba(0,0,0,.7); font-size:12px;font-weight:500;"></div>';

   let box = document.getElementById('log-box');

   // define a new console
   let console=(function(oldCons){

       return {
           log: function(...args){
               oldCons.log(args.join(' '));
               box.innerHTML += '<br/>[LOG]' + args.join(' ')
           },
           info: function (...args) {
               oldCons.info(args.join(' '));
               box.innerHTML += '<br/>[INFO]' + args.join(' ')
           },
           warn: function (...args) {
               oldCons.warn(args.join(' '));
               box.innerHTML += '<br/>[WARN]' + args.join(' ')
           },
           error: function (...args) {
               oldCons.error(args.join(' '));
               box.innerHTML += '<br/>[ERROR]' + args.join(' ')
           }
       };

   }(window.console));

   //Then redefine the old console
   window.console = console;

   window.onerror = function (err, file, line) {
       console.error('Sorry, looks like an error happened: ', err, '<br/>  - file:', file, ' - line:',  line);
       return true;
   }

   console.log('Logger has been initialized!');

   })(window, document);
