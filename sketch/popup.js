// get the object named ethic stored in the background script 
window.ethic = chrome.extension.getBackgroundPage().ethic;

// check the content of the products 
console.log(window.ethic)

// url_category
document.getElementById("url_category").href = window.ethic['0']
r = getRandomInt(10)

// top 3 Image
for (let i = 1; i<=3;i++) {
    // name_product
    if (window.ethic[(r+i).toString()].name.length < 22 ){
        document.getElementById("name"+ i.toString()).textContent = window.ethic[(r+i).toString()].name
    }
    else{
        document.getElementById("name"+ i.toString()).textContent = window.ethic[(r+i).toString()].name.substring(0,22)+'...'
    }
    // price
    document.getElementById("price"+ i.toString()).textContent = window.ethic[(r+i).toString()].price
    // image
    changerImage("image" + i.toString() , window.ethic[(r+i).toString()].image['0'])
    //ethicscore
    document.getElementById("score"+ i.toString()).textContent = window.ethic[(r+i).toString()].score
    //url of the product when you click on the name of the product
    document.getElementById("url_product"+i.toString()).href = window.ethic[(r+i).toString()].url
    //url of the product when you click on the image of the product
    document.getElementById("url_image"+i.toString()).href = window.ethic[(r+i).toString()].url
    // cashback
    if ( window.ethic[(r+i).toString()].cashback == null ) {
        document.getElementById("cashback"+ i.toString()).textContent = 0
    }
    else {
        document.getElementById("cashback"+ i.toString()).textContent = Math.round(100*parseFloat(window.ethic[(r+i).toString()].cashback))/100
    }
}

// random int 
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// Function that set the photo on the html file
function changerImage(id, src)
{
   // image object
   var image = new Image();
 
   // if there is an error 
   image.onerror = function()
   {
        if (typeof id == "string"){
            id = document.getElementById(id);
        }
        id.src = "img_not_found.jpeg";
   }
   image.onabort = function()
   {
        alert("Chargement interrompu");
   }
 
   // event : the chargement is done
   image.onload = function()
    {    
        if (typeof id == "string"){
           id = document.getElementById(id);
        }
        // we post the image
        id.src = image.src;
    }
 
   // we change the source of the object image
   // if the name of the source is not a link 
   if (src.substring(src.length-4) == 'jpeg'){
       image.src = 'https://static.ethicadvisor.org/'+ src.substring(0,src.length-10) + 'carrousel.jpeg'
   }
   // if it is a https link
   else {
       image.src = src
   }
}