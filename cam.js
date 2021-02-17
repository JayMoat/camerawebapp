ons.ready(function() {
	alert("Onsen UI is ready!");
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		alert(navigator.device.capture);
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(populateDb, errorCB, successDB);
		
		document.getElementById("getPosition").addEventListener("click", getPosition);
	}
});

document.addEventListener('show', function(event) {
	var page = event.target;
	var titleElement = document.querySelector('#toolbar-title');
	
	if (page.matches('#first-page')) {
		titleElement.innerHTML = 'My app - Page 1';
	} else if (page.matches('#second-page')) {
		titleElement.innerHTML = 'My app - Page 2';
	}
});

if (ons.platform.isIPhoneX()) {
	document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
	document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

/************************************************************************/

function snapPicture() {
	var captureSuccess = function(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i+= 1) {
			path = mediaFiles[i].fullPath;
			var image = document.getElementById('picture');
			image.src = path;
		}
	};
	
	// capture error callback
	var captureError = function(error) {
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	};
	
	// start image capture
	navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });
}

function snapVideo() {
	var captureSuccess = function(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			path = mediaFiles[i].fullPath;
			var v = "<video controls='controls' width='320' height='240'>";
			v += "<source src='" + path + "' type='video/mp4'>";
			v += "</video>";
			document.querySelector("#videoArea").innerHTML = v;
		}
	};
	
	// capture error callback
	var captureError = function(error) {
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	};
	
	// start video capture
	navigator.device.coature.captureImage(captureSuccess, captureError, { limit: 1 });
}

/************************************************************************/

const accesKey = 'vLlT9luLiG3rmBs5tFRiPpYSQz6NzXYbL4_RA0BptlU';
const endPoint = 'https://api.unsplash.com/search/photos';

async function getImages(query) {
	query = document.getElementById('searchString').value;
	let response = await fetch(endPoint + '?query=' + query + '&client_id=' + accesKey);
	let jsonResponse = await response.json();
	let imagesList = await jsonResponse.results;
	
	createImages(imagesList);
}

function createImages(imagesList) {
	for (let i = 0; i < imagesList.length; i++) {
		const image = document.createElement('imagen');
		image.src = imagesList[i].urls.thumb;
		
		document.body.appendChild(image);
		var image1 = document.getElementById('imagen');
		image1.src = image.src;
	}
}

/************************************************************************/

var currentRow;

function populateDB(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
		console.log(tx);
	}

	function queryDB(tx) {
		tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
	}

	function searchQueryDB(tx) {
		tx.executeSql("SELECT * FROM DEMO where name like ('%"+ document.getElementById("txtName").value + "%')",
				[], querySuccess, errorCB);
	}

	function querySuccess(tx, results) {
		var tblText='<table id="t01"><tr><th>ID</th> <th>Nombre</th> <th>Numero Socio</th></tr>';
		var len = results.rows.length;
		for (var i = 0; i < len; i++) {
			var tmpArgs=results.rows.item(i).id + ",'" + results.rows.item(i).name
					+ "','" + results.rows.item(i).number+"'";
			tblText +='<tr onclick="goPopup('+ tmpArgs + ');"><td>' + results.rows.item(i).id +'</td><td>'
					+ results.rows.item(i).name +'</td><td>' + results.rows.item(i).number +'</td></tr>';
		}
		tblText +="</table>";
		document.getElementById("tblDiv").innerHTML =tblText;
	}

	function deleteRow(tx) {
	  tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
	}

	function errorCB(err) {
		alert("Error processing SQL: "+err.code);
		console.log("Error processing SQL: "+err.code);
	}

	function successCB() {
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(queryDB, errorCB);
	}

	function insertDB(tx) {
		tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' +document.getElementById("txtName").value
				+'","'+document.getElementById("txtNumber").value+'")');
	}

	function goInsert() {
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(insertDB, errorCB, successCB);
	}

	function goDelete() {
		  var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		  db.transaction(deleteRow, errorCB);
	}

	function goPopup(row,rowname,rownum) {
		currentRow=row;
	}

/************************************************************************/

var Latitude = undefined;
    var Longitude = undefined;
    var pointA = undefined;
    var pointB = undefined;
    var labelus = 'B';

    function getPosition() {
      var options = {
          enableHighAccuracy: true,
          maximumAge: 3600000
      }
      var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      function onSuccess(position) {
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        getMap(Latitude, Longitude);
      };

      function onError(error) {
          alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
      }
    }

    function getMap(latitude, longitude) {
      var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 1,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map
      (document.getElementById("map-canvas"), mapOptions);

      var latLong = new google.maps.LatLng(latitude, longitude);
      pointA = latLong;

      var marker = new google.maps.Marker({
          position: latLong
      });

      google.maps.event.addListener(map, 'click', function(event) {
      addMarker(event.latLng, map);
      pointB = event.latLng;
      });

      // Adds a marker to the map.
      function addMarker(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        var marker2 = new google.maps.Marker({
          position: location,
          label: labelus,
          map: map
        });
        
        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map); // Existing map object displays directions
        // Create route from existing points used for markers
        const route = {
            origin: marker.getPosition(),
            destination: marker2.getPosition(),
            travelMode: 'DRIVING'
        }

        directionsService.route(route,
          function(response, status) { // anonymous function to capture directions
            if (status !== 'OK') {
              alert('Directions request failed due to ' + status);
              return;
            } else {
              directionsRenderer.setDirections(response); // Add route to the map
              var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
              if (!directionsData) {
                alert('Directions request failed');
                return;
              }
              else {
                alert(" Distance by car: " + directionsData.distance.text + " (" + directionsData.duration.text + ").");
              }
            }
          });
        }
