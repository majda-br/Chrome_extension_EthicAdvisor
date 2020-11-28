let message = {
    cat : "nothing",
    name : "nothing"
}

// Check if we are at amazon : 
if (window.location.href.substring(0,18) == "https://www.amazon"){
    // get the category of the product 
    let titles = document.getElementsByTagName("title")[0].text.split(':');
    // get what is written in the research box 
    let barSearch = document.getElementsByClassName("nav-search-field")[0].offsetParent.offsetParent.elements[3].value;

    let message = {
        cat : titles[titles.length -1].trim(),
        name : barSearch
    };
    // send the object to the background script 
    chrome.runtime.sendMessage(message);
}else{
    // send the object to the background script 
    chrome.runtime.sendMessage(message);
}
