/* declare global variables */

var keyTerms; //variable to hold the objects
var museums; //variable to hold museum objects
var museumTypes = []; //variable to hold museum types

var mainMap; //a handler object for the main "search map"


var selectedMuseumID = null;

var loadSelectedMuseumRunning = false;

var searchResultIDs =[];



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

//set up back buttons
$(document).ready(function () {
    $('.backToMain').on("click", function () {
        backToMain();
        console.log("back button clicked");
    });
});

$("#dataTable tbody tr").on("click", function () {
    console.log($(this).text());
});

// animate the main searchbar and filter-bar
$(document).ready(function () {
    var sb = $("#searchBarWrapper");
});

// read in the two data-files */
$(document).ready(function () {
    loadKeyTerms();
});

//listener on filterDropdowns
$(document).ready(function () {
    $("#filterType").change(function () {
        filterResults($("#filterType").val());
    });
});


(function ($) {
    $.fn.goTo = function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    }
})(jQuery);

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

//function to get back from details to main screen
function backToMain()
{
    loadSelectedMuseumRunning = false;
    $("#selectedMuseumScrollImageWrapper").empty();
    $("#selectedMuseumScrollImageWrapper").html('<div id="selectedMuseumScrollImage" class="fotorama" data-width="100%" '+
        'data-ratio="1900/550"'+
        'data-maxheight="550"'+
        'data-fit="cover"'+
        'data-loop="true"'+
        'data-autoplay="true"'+
        'data-shuffle="true"'+
        'data-arrows="true"'+
        'data-click="true"'+
        'data-swipe="false"'+
        'data-auto="false">'+
        '</div>');

    $(".detailsPage").hide("blind", 1000,
    function () {
        $(".mainPage").show("blind", 1000);
    });
}




//function to get the selected museum from the map infowindow
function selectMuseumDirectly(caller)
{
    console.log(caller.id);
    searchResponseHandler(caller.id);
}

// function to drive the search-bar - easyautocomplete version
function searchResponseHandler(val)
{
    if (val.charAt(0) == 'm') //it's a direct hit
    {
        selectedMuseumID = parseInt(val.slice(1));
        console.log(selectedMuseumID + " " + typeof selectedMuseumID);

        $(".mainPage").hide("blind", 1000,
            function () {
                $(".detailsPage").show("blind", 1000);
                loadSelectedMuseum();
            });
        

    }
    else //it's a term, fetch + open results
    {





        searchResultIDs = findMuseumsWithKeyterm(parseInt(val));

        buildFilterDropdowns();
        buildSearchResults(searchResultIDs);

        $("#searchResultsMainWrapper").show("blind", 1000);
        $("#searchResultsMainWrapper").goTo();

        console.log(parseInt(val));
        console.log(searchResultIDs);


        

    }

}

function buildFilterDropdowns()
{
    searchResultTypes = [];
    filterTypeHTML = "<option>Museum Type</option>";

    for (i = 0; i < searchResultIDs.length; i++) {

        //build filter dropdowns
        if (searchResultTypes.indexOf(museums[searchResultIDs[i]].museum_type) == -1) {
            searchResultTypes.push(museums[searchResultIDs[i]].museum_type);
            filterTypeHTML += '<option>' + museums[searchResultIDs[i]].museum_type + '</option>';
        }
    }

    $("#filterType").html(filterTypeHTML);
}

function buildSearchResults(resultsArray)
{
    var resultLi = "";
    for (i = 0; i < resultsArray.length; i++) {

        //build up the list to display
        resultLi += '<li class="collection-item infoWindowViewDetails">'
            + museums[resultsArray[i]].museum_name +' - ' + museums[resultsArray[i]].museum_type
            + '<span style="float:right" onclick="selectMuseumDirectly(this)" id="m' + resultsArray[i] + '" > view details...</span></li>';
    }

    $("#searchResultsContent").html('<ul class="collection">' + resultLi + '</ul>');
}



function filterResults(type)
{

    var filteredSearchResultIDs = [];

    for (i = 0; i < searchResultIDs.length; i++) {

        if (type == "Museum Type") {
            filteredSearchResultIDs.push(searchResultIDs[i]);
        }
        else {

            if (museums[searchResultIDs[i]].museum_type == type) {
                filteredSearchResultIDs.push(searchResultIDs[i]);
            }
        }
    }

    buildSearchResults(filteredSearchResultIDs);
}


function findMuseumsWithKeyterm(keyterm)
{
    resultIDs = [];

    for (i = 0; i < museums.length; i++)
    {
        for (j = 0; j < museums[i].keyterms.length; j++ )
        {

            if (museums[i].keyterms[j] == keyterm)
            {
                resultIDs.push(i);
            }
        }
    }

    return resultIDs;
}



function loadSelectedMuseum()
{
    if (!loadSelectedMuseumRunning) {
        loadSelectedMuseumRunning = true;

        console.log('LOADING SELECTED MUSEUM!');

        //setting the top image-slider
        $('#selectedMuseumScrollImage').html(buildselectedMuseumScrollImages());
        $('.fotorama').fotorama();


        //setting the name
        $('#selectedMuseumName').html(museums[selectedMuseumID].museum_name);

        //setting type
        $('#selectedMuseumType').html('venue type: ' + museums[selectedMuseumID].museum_type);

        //setting description
        $('#selectedMuseumDescription').html(museums[selectedMuseumID].museum_description);

        //setting opening times
        $('#openingTimesContainer').html(buildOpeningTimesHTML());

        //setting closed days
        $('#closedDayssContainer').html(buildClosedDaysHTML());

        //setting feature image
        $('#selectedFetureImageContainer').html(
            '<img id="selectedFeatureImage" alt="feature image" src="'
            + getRandomImageURL(selectedMuseumID)
            + '"/>'
            + '<p class="center-align">featured image</p>'
            );

        //setting up distances and times
        $('#drivingMiles').html(museums[selectedMuseumID].distance_citycentre.driving_miles);
        $('#drivingMinutes').html(museums[selectedMuseumID].distance_citycentre.driving_minutes);
        $('#walkingMiles').html(museums[selectedMuseumID].distance_citycentre.walking_miles);
        $('#walkingTime').html(museums[selectedMuseumID].distance_citycentre.walking_minutes);

        //setting website url
        $('#selectedMuseumURLWrapper').html('official website: <a href="' + museums[selectedMuseumID].website + '" target="_blank">' + museums[selectedMuseumID].website + '</a>');


        //setting the selected map
        initDetailsMap();

    }
}


function buildOpeningTimesHTML()
{
    var keys = Object.getOwnPropertyNames(museums[selectedMuseumID].opening_hours);

    var output = '<table class="centered">';

    for (i = 0; i < keys.length; i++)
    {
        output += "<tr> <td>";
        output += keys[i];
        output += "</td> <td>";
        output += museums[selectedMuseumID].opening_hours[keys[i]];
        output += "</td> </tr>";
        }

    output += "</table>";

    return output;
}

function buildClosedDaysHTML() {

    output = museums[selectedMuseumID].closed_days[0];
    for (i = 1; i < museums[selectedMuseumID].closed_days.length; i++)
    {
        output += ", ";
        output += museums[selectedMuseumID].closed_days[i];

    }

    return output;
}

function buildselectedMuseumScrollImages()
{
    images = buildImageURL(selectedMuseumID);
    output = "";

    for (i = 0; i < images.length;i++)
    {
        
        output += '<img src="' + images[i] + '" data-caption="' + museums[selectedMuseumID].images[i].description + '">';
    }
    console.log(output);
    return output;
}


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
                searchResponseHandler(value);
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
            '<div class="right-align infoWindowViewDetails"><span onclick="selectMuseumDirectly(this)" id="m' + id + '">view details...</span></div>' +
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

        $("#mainFeature1 .card-action").html('<a onclick="selectMuseumDirectly(this)" id = "m' + f1 + '" href="#">view details...</a>');
        $("#mainFeature2 .card-action").html('<a onclick="selectMuseumDirectly(this)" id = "m' + f2 + '" href="#">view details...</a>');

        


    }

    buildmarkers();
    getMuseumTypes();
    buildFeatured();
    setupSearchBar();

    $(".openSelectedFromMap").on("click", function () {
        console.log("aaa");//$(this).id);
    });
    
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

}


function initDetailsMap() {

    var museumLocation = new google.maps.LatLng(museums[selectedMuseumID].lat, museums[selectedMuseumID].long);
    detailsMap = new google.maps.Map(document.getElementById('detailsMap'), {
        zoom: 15, //+-4
        center: museumLocation
    });

    var windowOffset = new google.maps.Size(0, -20);

    var marker = new google.maps.Marker({
        position: museumLocation,
        title: "detailMarker",
    });


    var infowindow = new google.maps.InfoWindow({
        content: buildDetailsMapInfoWindowContent(),
        maxWidth: 400,
        position: museumLocation,
        pixelOffset: windowOffset

    });

    infowindow.open(detailsMap);

    marker.addListener('click', function () {
        infowindow.open(detailsMap);
    });


    marker.setMap(detailsMap);

}

function buildDetailsMapInfoWindowContent() {


    var contentString = '<div>' +
        '<h5 id="firstHeading" class="firstHeading">' + museums[selectedMuseumID].museum_name + '</h5>' +
        '<div id="bodyContent">' +

        '<p> <span class="underlined">venue type</span>: ' + museums[selectedMuseumID].museum_type + '</p>' +
        '<p>' + museums[selectedMuseumID].museum_description + '</p>' +
        '<p> <span class="underlined">address</span>: <br />' + museums[selectedMuseumID].address + '<br/>' +
            museums[selectedMuseumID].postcode + '</p>' +
        '</div>' +
        '</div>';

    return contentString;
}