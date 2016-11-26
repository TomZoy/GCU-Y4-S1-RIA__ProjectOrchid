
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


