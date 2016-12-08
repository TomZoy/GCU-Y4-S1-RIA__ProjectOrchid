/* declare global variables */

//keyTerms
var isKeytermsLoaded = false;
var keyTerms = []; //variable to hold the objects
var museums = []; //variable to hold museum objects



/* custom scripts */

//function to randoml select the hero image and load it when the main page loads
function loadHeroImage() {
    //initialise variables
    var heroImagePrefix = "images/hero/";
    var heroImageArray = [
        "pexels-photo-135018.jpeg",
        "pexels-photo-135019.jpeg",
        "pexels-photo-457896.jpg",
        "pexels-photo-457989.jpg",
        "pexels-photo-585995.jpg"
    ];

    //set the hero image randomly
    var i = Math.floor((Math.random() * heroImageArray.length));
    $("#heroImage").css("background-image", "url('" + heroImagePrefix + heroImageArray[i] + "')");

    console.log("url('" + heroImagePrefix + heroImageArray[i] + "')");
};
$("#heroImage").ready(function() {
    loadHeroImage();
});



//function to parse searchTerms from php
function loadKeyTerms() {

    //get the JSON from the php file, and store it to an array
    $.getJSON("keyterms.php", function (data) {

        $.each(data, function (key, val) {

            $.each(val, function (key2, val2) {
                var keyTerm = new Object();
                keyTerm.id = val2.term_id;
                keyTerm.term = val2.term;
                keyTerms.push(keyTerm);
            });
        });

        isKeytermsLoaded = true;

    });

}



//function to parse museums from php
function loadMuseums() {

    //get the JSON from the php file, and store it to an array
    $.getJSON("museums.php", function (data) {

        console.log(data);
        return data;

    });

}


// function to drive the search-bar
$(document).ready(function () {
    $('input.autocomplete').autocomplete({
            data: {
                "Apple": null,
                "Microsoft": null,
                "Google": 'http://placehold.it/250x250'
            }
        });
});

// animate the main searchbar
$(document).ready(function () {
    var sb = $("#searchBarWrapper");
    sb.focusin(function () {
        if (sb.hasClass("m4")) {
            sb.removeClass("m4 offset-m4");
            sb.addClass("m8 offset-m2");
        }
    });
    sb.focusout(function () {
        if (sb.hasClass("m8")) {
            sb.removeClass("m8 offset-m2");
            sb.addClass("m4 offset-m4");
        }
    });
});


//set up the accordions
$(document).ready(function () {
    $('.collapsible').collapsible();
});

//<!--set up the map-->

function initMap() {
    var museumLocation = {lat: 55.868, lng: -4.2905};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: museumLocation
    });

    var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the ' +
    'Heritage Site.</p>' +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';



    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400,
        position: museumLocation

    });

    var marker = new google.maps.Marker({
        position: museumLocation,
        map: map,
        title: 'Uluru (Ayers Rock)'
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
















      var marker = new google.maps.Marker({
          position: marker,
          map: map
      });

      marker.setMap(map);

  }
