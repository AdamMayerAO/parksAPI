'use strict';
const baseURL = 'https://developer.nps.gov/api/v1/parks'
const apiKeyURL = 'https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=sSuCHy3jDscyCHnChNVqaQmZsXU09OlkcjXne6ta';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  //console.log(responseJson.data[1].addresses[0])
  
  $('#results-list').empty();
  $('#js-error-message').empty();
  $('#results').removeClass("hidden");
  for (let i = 0; i<responseJson.data.length; i++){
    const addressInfo = responseJson.data[i].addresses[0]
    console.log(addressInfo)
    const addressValues = Object.values(addressInfo)
    const address = addressValues[3]+" "+addressValues[5]+" "+addressValues[6]+" <br>"+addressValues[1]+" "+addressValues[2]+" "+addressValues[0]


    //const address = (addressInfo(line1);/*addressInfoline2 + addressInfo.line3 + addressInfo.city + addressInfo.stateCode + addressInfo.postalCode);*/
    
    const parkURL = responseJson.data[i].url
    const parkFullName = responseJson.data[i].fullName
    const parkDiscription = responseJson.data[i].description
    //console.log(addressInfo)
    //console.log(address)
    $('#results-list').append(`
    <li><a href="${parkURL}" target="_blank">${parkFullName}</a><br>${parkDiscription}<br><h5>Address:<br>${address}</h5>`)
    

  }
};

function getNatlParks(query, maxResults=10) {
  console.log('gettingNP')
  const params= {
    stateCode: query,
    limit: maxResults,
    api_key: "sSuCHy3jDscyCHnChNVqaQmZsXU09OlkcjXne6ta",
    
  }
  const queryString = formatQueryParams(params)
  const url = baseURL + '?' + queryString;
  //`https://developer.nps.gov/api/v1/parks?stateCode=${query}&api_key=sSuCHy3jDscyCHnChNVqaQmZsXU09OlkcjXne6ta`

  //console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
   .then(responseJson => displayResults(responseJson))
       

    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}


function watchForm() {
  console.log("watching...")
  $('form').submit(event => {
    event.preventDefault();
    const stateCode = $('#js-search-term').val();
console.log(stateCode)
    const maxResults = $('#js-max-results').val();
    getNatlParks(stateCode, maxResults);
  });
}

$(watchForm);