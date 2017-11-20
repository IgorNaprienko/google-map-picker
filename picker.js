var MapMarker = (function () {
    function MapMarker(elem, data) {
        this.data = {
            myLatLng: {
                lat: 50.363, lng: 35.000
            }, address: 'your default address'
        };
        if (data) {
            for (var i in data) {
                this.data[i] = data[i];
            }
        }
        this.mapContainer = elem.querySelector("map");
        this.search = elem.querySelector("input[name=search]");
        this.address = elem.querySelector("input[name=address]");
        this.lat = elem.querySelector("input[name=lat]");
        this.lng = elem.querySelector("input[name=lng]");
        this.init();
    }
    MapMarker.prototype.init = function () {
        var _this = this;
        this.map = new google.maps.Map(this.mapContainer, {
            zoom: 16, center: this.data.myLatLng
        });
        this.marker = new google.maps.Marker({
            position: this.data.myLatLng, draggable: true, map: this.map
        });
        var geocoder = new google.maps.Geocoder;
        var autocomplete = new google.maps.places.Autocomplete(_this.search, { types: ['geocode'] });
        autocomplete.addListener('place_changed', fillInAddress);
        function fillInAddress() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
            console.log(place.formatted_address);
            _this.data.address = place.formatted_address;
            _this.data.myLatLng = place.geometry.location.toJSON();
            _this.update();
        }
        this.marker.addListener('dragend', function (e) {
            var pos = e.latLng.toJSON();
            _this.data.myLatLng = pos;
            geocodeLatLng(geocoder, pos, function (mes) {
                _this.data.address = mes;
                _this.update();
            });
        });
        _this.update();
    };
    MapMarker.prototype.update = function () {
        this.search.value = this.data.address;
        this.address.value = this.data.address;
        this.lat.value = this.data.myLatLng.lat;
        this.lng.value = this.data.myLatLng.lng;
        this.marker.setPosition(this.data.myLatLng);
        this.map.setOptions({
            zoom: 16, center: this.data.myLatLng
        });
    };
    return MapMarker;
}());
function geocodeLatLng(geocoder, latlng, callback) {
    geocoder.geocode({
        'region': 'ru', 'language': 'ru', 'location': latlng
    }, function (results, status) {
        var res;
        if (status === 'OK') {
            if (results[0]) {
                res = results[0].formatted_address;
            }
            else {
                res = 'No results found';
            }
        }
        else {
            res = 'Geocoder failed due to: ' + status;
        }
        if (callback) {
            callback(res);
        }
    });
}
