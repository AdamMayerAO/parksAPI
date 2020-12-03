'use strict';
const baseURL = 'https://developer.nps.gov/api/v1/parks'


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {  
  $('#results-list').empty();
  $('#js-error-message').empty();
  $('#results').removeClass("hidden");
  for (let i = 0; i<responseJson.data.length; i++){
    //Address
    const addressValues = Object.values(responseJson.data[i].addresses[0])
    const address = addressValues[3]+" "+addressValues[5]+" "+addressValues[6]+" <br>"+addressValues[1]+" "+addressValues[2]+" "+addressValues[0]
    
    //Park Info
    const parkURL = responseJson.data[i].url
    const parkFullName = responseJson.data[i].fullName
    const parkDiscription = responseJson.data[i].description
    
    $('#results-list').append(`
    <li><a href="${parkURL}" target="_blank">${parkFullName}</a><br>${parkDiscription}<br><h5>Address:<br>${address}</h5>`)
  }
};

function getNatlParks(query, maxResults) {
  const codes = query.split(',').map(code=>'stateCode='+code).join('&')
  
  const params= {
    //stateCode: query,
    limit: maxResults,
    api_key: "sSuCHy3jDscyCHnChNVqaQmZsXU09OlkcjXne6ta",
  }
  const queryString = formatQueryParams(params)
  const url = baseURL + '?' + 'stateCode='+ query+'&' + queryString;
console.log(url)
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
  $('form').submit(event => {
    event.preventDefault();
    const stateCode = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNatlParks(stateCode, maxResults);
  });
}

$(watchForm);