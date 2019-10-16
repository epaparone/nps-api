'use strict';

// first I need to add my API key and maybe a search url
const apiKey = 'NDAVUGL49uDwIJzHvSn1ckCz20RUMb2iz3wKbiig';
const baseURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    console.log(queryItems);
    return queryItems.join('&');
}

function getParks(stateAbbr, listNumber) {
    // create list of parameters
    const params = {
        stateCode: stateAbbr,
        limit: listNumber,
        start: 1,
        api_key: apiKey,
    };

    // query string passed in
    const queryString = formatQueryParams(params);
    const url = baseURL + '?' + queryString;

    console.log(url);
    
    // creates a fetch command using baseURL apiKey & querystring
    // fetch command includes results handling - .json/responseJson & alert if needed
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
            throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayResponse(responseJson))
        .catch(error => alert('Something went wrong. Try again.'));
}

function displayResponse(responseJson) {
    console.log(responseJson);
    // deletes previous DOM additions
    $('.js-results').empty();
    
    // iterates through the results object & adds a listing per item
    // accesses the desired results, creates html string
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.js-results').append(
            `<li>
                <h3>${responseJson.data[i].fullName}</h3>
                <p>${responseJson.data[i].description}</p>
                <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
            </li>`
        )};
    $('.results-list').removeClass('hide');
}

function watchForm(searchTerm) {
    // adds an event listener to the form
    $('.submit-button').click(event => {
        // prevents default submission, reads user input
        event.preventDefault();

        // formats input
        const stateAbbr = ($('#choose-state').val()).toString();
        console.log(stateAbbr);
        const listNumber = $('#js-list-number').val();
        getParks(stateAbbr, listNumber);
    });
}

$(document).ready(function() {
    console.log('App loaded! Waiting on user input.')
    watchForm();
})