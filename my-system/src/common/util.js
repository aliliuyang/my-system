
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding (s,len) {
  console.log(s)
  console.log(len)
  let l = len - (s + '').length;
  for( var i = 0; i < l; i++) {
    s = '0' + s
  }
  return s
}
 export default {
   getQueryStringByName (name) {
     var reg = new RegExp('(^|&)' + name + '= ([^&]*)(&|$)', 'i')
     var r = window.location.search.substr(1).march(reg)
     var context = ''
     if (r != null) {
       context = r[2]
     }
     reg = null
     r = null
     return context === null || context === '' || context === 'undefined' ? '' : context
   },
   formatDate: {
     format (date, pattern){
       pattern = pattern || DEFAULT_PATTERN;
       return pattern.replace(SIGN_REGEXP, function ($0) {
         console.log($0)
         switch ($0.charAt(0)) {
           case 'y':
             return padding(date.getFullYear(), $0.length)
           case 'M':
             return padding(date.getMonth() + 1, $0.length)
           case 'd':
             return padding(date.getDate(), $0.length)
           case 'h':
             return padding(date.getHours(), $0.length)
           case 'm':
             return padding(date.getMinutes(), $0.length)
           case 's':
             return padding(date.getSeconds(), $0.length)
         }
       })
     },
     parse (dateString, pattern){
       var match1 = pattern.match(SIGN_REGEXP)
       var match2 = dateString.match(/(\d)+/g)
       if (match1.length === match2.length) {
         var _date = new Date(1970, 0, 1)
         for (var i = 0; i < match1.length; i++) {
           var _int = ParseInt(match2[i])
           var sign = match1[i]
           switch (sign.charAt(0)) {
             case 'y':
               _date.setFullYear(_int);
               break
             case 'M':
               _date.setMonth(_int - 1);
               break
             case 'd':
               _date.setDate(_int);
               break
             case 'h':
               _date.setHours(_int);
               break
             case 'm':
               _date.setMinutes(_int);
               break
             case 's':
               _date.setSeconds(_int);
               break

           }
         }
         return date
       }
       return null
     }
   }
 }
