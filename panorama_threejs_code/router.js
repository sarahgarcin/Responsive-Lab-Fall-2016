var _ = require("underscore");
var url = require('url')
var fs = require('fs-extra');
var os = require('os');


module.exports = function(app,io,m){

  /**
  * routing event
  */
  app.get("/", getIndex);
  app.get("/panorama", getPanorama);

  /**
  * routing functions
  */

  // GET
  function getIndex(req, res) {
    getLocalIP().then(function(localNetworkInfos) {
      res.render("index", {title : "Panorama", ip: localNetworkInfos.en5});
      console.log(localNetworkInfos.en5);
    }, function(err) {
      console.log('err ' + err);
      res.render("index", {title : "Panorama"});
      reject(err);
    });
  };

  function getPanorama(req, res) {
    res.render("panorama", {title : "Panorama-1"});
  };


  // from http://stackoverflow.com/a/8440736
  function getLocalIP() {
    return new Promise(function(resolve, reject) {
      var ifaces = os.networkInterfaces();
      var networkInfo = {};
      Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' === iface.family && iface.internal === false) {
            networkInfo[ifname] = iface.address;
          }
        });
      });
      resolve(networkInfo);
    });
  }

};
