/* declare global variables */

var keyTerms; //variable to hold the objects
var museums; //variable to hold museum objects
var museumTypes = []; //variable to hold museum types

var mainMap; //a handler object for the main "search map"


var selectedMuseum = null;


/***************************************************************************************/
/* pre-load scripts */

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
$("#heroImage").ready(function () {
    loadHeroImage();
});


/***************************************************************************************/
/* post-load scripts */

//set up the accordions
$(document).ready(function () {
    $('.collapsible').collapsible();
});





// animate the main searchbar and filter-bar
$(document).ready(function () {
    var sb = $("#searchBarWrapper");

    /*
    sb.focusin(function () {
        if (sb.hasClass("m4")) {
            sb.removeClass("m4 offset-m4");
            sb.addClass("m8 offset-m2");
        }
        return false;
    });

    sb.focusout(function () {
        if (sb.hasClass("m8")) {
            sb.removeClass("m8 offset-m2");
            sb.addClass("m4 offset-m4");
        }

        return false;
    });
    */

});

// read in the two data-files */
$(document).ready(function () {
    loadKeyTerms();
});


/***************************************************************************************/
/* "private" methods, triggered by other methods */

// function to drive the search-bar / built in version
//function setupSearchBar() {
//    $('input.autocomplete').autocomplete({
//        data: {
//            "Apple": null,
//            "Microsoft": null,
//            "Google": 'http://placehold.it/250x250'
//        }
//    });
//};


// function to drive the search-bar - easyautocomplete version
function setupSearchBar() {


    var options = {
        data: getsearchData(),//["blue", "green", "pink", "red pillow", "yellow"],
        placeholder: "try typing a museum's name, type, location, or a keyword ",
        getValue: "sTerm",
        list: {
            maxNumberOfElements: 15,
            match: {
                enabled: true
            },
            onChooseEvent: function () {
                var value = $("#searchBar").getSelectedItemData().sTargetID.toString();
                alert("Click ! " + value);
            }
        }
    };

    $("#searchBar").easyAutocomplete(options);


    function getsearchData()
    {
        var searchData = [];

        for (i = 0; i < museums.length; i++)
        {


            //get the names
            var searchDataObj = new Object();
            searchDataObj.sTerm = museums[i].museum_name;
            searchDataObj.sTargetID = 'm'+i;
            searchData.push(searchDataObj);

            //add the types
            /*
            var searchDataObj = new Object();
            if (searchData.indexOf(museums[i].museum_type) == -1) {
                museumTypes.push(museums[i].museum_type);
            }
            */

            //address
            var searchDataObj = new Object();
            searchDataObj.sTerm = museums[i].address;
            searchDataObj.sTargetID = 'm'+i;
            searchData.push(searchDataObj);

        }

        for (i = 0; i < keyTerms.length; i++)
        {
            var searchDataObj = new Object();
            searchDataObj.sTerm = keyTerms[i].term;
            searchDataObj.sTargetID = i;

            searchData.push(searchDataObj)
        }

        console.log(searchData);

        return searchData;

    }

}


//build a list of images from the selected museum
function buildImageURL(museumID) {
    var baseURL = "images/";
    result = [];

    var totalimages = museums[museumID].images.length;

    for (i = 0; i < totalimages; i++) {
        result.push(baseURL + museums[museumID].images[i].url);
    }

    //console.log(result);
    return result;

}


//give a random image from the given museum
function getRandomImageURL(museumID) {
    //get the list of all associated photos
    var allPhotos = [];
    allPhotos = buildImageURL(museumID);

    //pick a random number
    var i = Math.floor((Math.random() * allPhotos.length));

    console.log("picked: ");
    console.log(allPhotos[i]);
    return allPhotos[i];

}




//function to build markers for the main map
function buildmarkers() {

    var infoWindows = [];
    var windowOffset = new google.maps.Size(0,-20);

    for (i = 0; i < museums.length; i++)
    {
        var myLatlng = new google.maps.LatLng(museums[i].lat, museums[i].long);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title: i.toString(),
        });


        var infowindow = new google.maps.InfoWindow({
            content: buildInfoWindowContent(i),
            maxWidth: 400,
            position: myLatlng,
            pixelOffset: windowOffset

        });



        infoWindows.push(infowindow);

        //infoWindows[i].open(mainMap);

        marker.addListener('click', function () {
            
            openInfoWindow(this.title);
            console.log(this.title);
        });


        marker.setMap(mainMap);
    }


    function openInfoWindow(id)
    {

        for (i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }

        infoWindows[id].open(mainMap);
    }

    function buildInfoWindowContent(id)
    {


        var contentString = '<div>' +
            '<h4 id="firstHeading" class="firstHeading">' + museums[id].museum_name + '</h4>' +
            '<div id="bodyContent">' +
            '<img class="mapInfoWindowImage" src="images/' + museums[id].images[0].url + '" />' +
            
            '<p>' + museums[id].museum_description + '</p>' +

            '</div>' +
            '</div>';

        return contentString;
    }

}




//function to parse searchTerms from php
function loadKeyTerms() {

    //get the JSON from the php file, and store it to an array
    $.getJSON("keyterms.php", function (data) {
        keyTerms = data.keyterms;
        console.log(keyTerms);

        loadMuseums();

    });

}


//function to parse museums from php
function loadMuseums() {

    //get the JSON from the php file, and store it to an array
    $.getJSON("museums.php", function (data) {
        museums = data.museums;
       // console.log(museums);

        onDataLoaded();
    });
}





/***************************************************************************************/
/* functions dependent on the loaded data */


function onDataLoaded(){

    //function to list museum types
    function getMuseumTypes()
    {
        for (i = 0; i < museums.length; i++) {
        
            if (museumTypes.indexOf(museums[i].museum_type) == -1)
            {
                museumTypes.push(museums[i].museum_type);
            }        
        }

        console.log(museumTypes);
    }


    //build two featured cards
    function buildFeatured() {

        //select a random museum
        var f1 = Math.floor((Math.random() * museums.length));

        do {
            var f2 = Math.floor((Math.random() * museums.length));
        }
        while (f1 == f2);

        $("#feature1Image").attr("src", getRandomImageURL(f1));
        $("#feature2Image").attr("src", getRandomImageURL(f2));

        $("#feature1Title").html(museums[f1].museum_name);
        $("#feature2Title").html(museums[f2].museum_name);
        
        $("#feature1Desc").html(museums[f1].museum_description);
        $("#feature2Desc").html(museums[f2].museum_description);


    }

    buildmarkers();
    getMuseumTypes();
    buildFeatured();
    setupSearchBar();
};




//set up the map

function initMaps()
{
    //console.log("MAPS RULE");
    initMainMap();
}


function initMainMap() {
    var middle = { lat: 55.86, lng: -4.223 };
    mainMap = new google.maps.Map(document.getElementById('mainMap'), {
        zoom: 12, //+-4
        center: middle
    });

    /*
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

    var myLatlng = new google.maps.LatLng(55.859937, -4.252958);


    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400,
        //position: myLatlng

    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        title: 'Uluru (Ayers Rock)'
    });

    marker.addListener('click', function () {
        infowindow.open(mainMap, marker);
    });


    marker.setMap(mainMap);

    */

}



























/*


//set up the map

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

  */
//parse, format, and inject the opening times of the object
function loadOpeningTimes() {
    if (selectedMuseum != null)
    {
        generatedHtml = "";

        if (selectedMuseum.opening_hours != "") {
           // selectedMuseum.opening_hours
        }
        $('#openingTimesContainer').empty(); //clear the container
        $('#openingTimesContainer').append(generatedHtml); //ad content to the container
    }


}