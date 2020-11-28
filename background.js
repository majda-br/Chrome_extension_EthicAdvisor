// Check if the background is running 
console.log("background running");

// set the variable id which will be used to stock the id 
let id = "id";

// set a dictionnary that link the categories from Amazon to the ones on EthicAdvisor
var match_cat = {
    "Beauté et Parfum":"Soin et Beauté",
    "Beauté Prestige":"Soin et Beauté",
    "Bijoux":"Mode et accessoires",
    "Bébés et Puériculture":"Petite enfance",
    "Chaussures et Sacs":"Mode et accessoires",
    "Cuisine & Maison":"Maison",
    "Epicerie":"Alimentation",
    "Hygiène et Santé":"Soin et Beauté",
    "Jardin":"Maison",
    "Luminaires et Eclairage":"Maison",
    "Mode":"Mode et Accessoires",
    "Vêtements et accessoires":"Mode et accessoires",
    "Vêtements":"Mode et accessoires"
}

// set a dictionnary that link the categories from EthicAdvisor to their id 
var match_id={
    "Alimentation":6,
    "Soin et Beauté":22,
    "Mode et accessoires":31,
    "Services":42,
    "Maison":46,
    "Loisirs et idées cadeaux":50,
    "Petite Enfance":54
}

// set a dictionnary that link the categories from EthicAdvisor to their URL

var match_url={
    "Alimentation":"https://www.ethicadvisor.org/search/alimentation",
    "Soin et Beauté":"https://www.ethicadvisor.org/search/soins-beaute",
    "Mode et accessoires":"https://www.ethicadvisor.org/search/mode-accessoires",
    "Services":"https://www.ethicadvisor.org/search/services",
    "Maison":"https://www.ethicadvisor.org/search/maison",
    "Loisirs et idées cadeaux":"https://www.ethicadvisor.org/search/loisirs-idees-cadeaux",
    "Petite Enfance":"https://www.ethicadvisor.org/search/petite-enfance"
}


// receive the object from the content script and stock it in request
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        console.log("background.js got a message")
        console.log(request)

        // set a list that will be called in the popup script
        window.ethic = new Array()

        // If the category from amazon exist in the dictionnary match_cat
        if (request.cat in match_cat){
            // set the popup window to be popup.html 
            chrome.browserAction.setPopup({popup: 'sketch/popup.html'});
            //set the icon to be logo_icone_blue_64.png
            chrome.browserAction.setIcon({path:{"64":"sketch/logo_icone_blue_64.png"}});
            // add the badge ( the blue box in the icon containing the "!")
            chrome.browserAction.setBadgeText({text: "!"});

            console.log('It exists')

            // get the id of the category
            id = match_id[match_cat[request.cat]];
            // N first product with their name, description, url, score and price 
            var promiseB = searchProductsByCategory(id).then(function(result) {
                // URL 
                window.ethic.push(match_url[match_cat[request.cat]])
                // The rest ( name / score / image / price ... )
                for (let pas = 0; pas < 15; pas++) {
                    let product = {
                        name:result['hits'][pas.toString()]._source.name,
                        description:result['hits'][pas.toString()]._source.summary,
                        url:"https://www.ethicadvisor.org/p/"+ result['hits'][pas.toString()]._source.slug,
                        score:result['hits'][pas.toString()]._source.ethic_score,
                        image:result['hits'][pas.toString()]._source.photos,
                        price:result['hits'][pas.toString()]._source.selling_price_ttc,
                        cashback:result['hits'][pas.toString()]._source.cashback,
                    };
                    window.ethic.push(product)
                }
            });
        }
        else {
            // set the popup window to be sans_resultat.html
            chrome.browserAction.setPopup({popup: 'sketch/sans_resultat.html'});
            // set the icon to be logo_icone_black_64.png
            chrome.browserAction.setIcon({path:{"64":"sketch/logo_icone_black_64.png"}});
            // erase the badge ( the blue box that appear on the icon )
            chrome.browserAction.setBadgeText({text: ""});
        }
    }
);


// Get a list of product according to the id of the category  from EthicAdivor API 

function searchProductsByCategory(categoryId) {
    const url = `https://search.ethicadvisor.org/products-21/product/_search`;
    return fetch(url, {
        credentials: 'omit', // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            query: {
                function_score: {
                    query: {
                        bool: {
                            must: {
                                match: {
                                    search: {
                                        query: "",
                                        zero_terms_query: 'all'
                                    }
                                }
                            },
                            filter: [
                              { term: { completed: true } },
                              { term: { categories: categoryId } }
                            ]
                        }
                    },
                    functions: [{ field_value_factor: { field: 'ethic_score' } }],
                    score_mode: 'sum'
                }
            },
            sort: ['_score', { ethic_score: 'desc' }, '_id'],
            from: 0,
            size: 24
        })
    })
        .then(response => response.json())
        .then(data => {
            return {
                hits: data['hits'].hits,
                nbHits: data['hits'].total,
            };
        })
        .catch(error => console.error('===> ERROR searchProductsByCategory:', error));
}