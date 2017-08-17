export function httpGet(url, target, callback){
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.onreadystatechange = function() {
  if (xmlHTTP.readyState==4 && xmlHTTP.status==200) {
    console.log("Response received! WE DID IT!");
    var response = JSON.parse(xmlHTTP.responseText)
    callback(target, response);
  }
  };
  xmlHTTP.open('GET', url, true );
  xmlHTTP.send(null);
}