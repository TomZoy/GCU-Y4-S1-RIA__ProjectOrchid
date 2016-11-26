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

