if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function decodeQueryString (search) {
  var args = document.location.search.substring(1).split('&');
  var result = {};

  search = search || document.location.search.substring(1); 
  args = search.split('&');

  for (var i = 0; i < args.length; i++) {
    var arg = decodeURIComponent(args[i]);
    
    if (arg.indexOf('=') == -1) {
      result[arg.trim()] = true;
    } else {
      kvp = arg.split('=');
      result[kvp[0].trim()] = kvp.slice(1).join('=').trim();
    }
  }

  return result;
}


function getSelectedOptions (elem) {
  var result = [];

  for (var i = 0; i < elem.options.length; i++) {
    if (elem.options[i].selected) {
      result.push({
        title: elem.options[i].innerText || elem.options[i].innerHTML,
        value: elem.options[i].value
      });
    }
  }

  return result;
}