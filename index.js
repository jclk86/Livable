"use strict";
// HI
const googleApiKey = "AIzaSyCFlgvXsaF3aL5dJ_KTmlKG3SbqsL2vrb8";
const dataDemographKey = "k_0218e326c3fa2590382dd9482ac43f95";
const useCensusKey = "cd61f085312fedfc60923ae2605d954d1a7e3363";
const usCensus_URL = "https://api.census.gov/data/2017/acs/acs1/profile";
const dataUSA_URL = "https://datausa.io/api/data?drilldowns=Place&measures=";
const dataDemograph_URL = "https://api.datademograph.com/v1/";
const geoCoding_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const googlePlacesSearch_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const results = $("#results-list");

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function formatInteger(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getData(county, state) {
  Promise.all([
    // native pop
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0087PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // foreign pop
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0092PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // some college
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0061PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // in college
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0057PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), //Graduated College
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0065PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // Unemployed
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP03_0009PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // Below poverty
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP03_0119PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // occupied homes
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0002PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // vacant homes
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0003PE,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // homeowner vacancy
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0004E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // rental vacancy
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0005E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // total population
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP02_0078E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // total housing units
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0006E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // median household income
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP03_0062E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    ), // rent expense
    fetch(
      encodeURI(
        `https://api.census.gov/data/2017/acs/acs1/profile?get=DP04_0134E,NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
      )
    )
  ])
    .then(
      async ([
        response1,
        response2,
        response3,
        response4,
        response5,
        response6,
        response7,
        response8,
        response9,
        response10,
        response11,
        response12,
        response13,
        response14,
        response15
      ]) => {
        const nativePopulation = await response1.json();
        const foreignPopulation = await response2.json();
        const someCollege = await response3.json();
        const inCollege = await response4.json();
        const graduatedCollege = await response5.json();
        const unemployed = await response6.json();
        const belowPoverty = await response7.json();
        const occupiedHomes = await response8.json();
        const vacantHomes = await response9.json();
        const homeownerVacany = await response10.json();
        const rentalVacany = await response11.json();
        const totalPopulation = await response12.json();
        const totalHousingUnits = await response13.json();
        const householdIncome = await response14.json();
        const rentExpense = await response15.json();
        return [
          nativePopulation,
          foreignPopulation,
          someCollege,
          inCollege,
          graduatedCollege,
          unemployed,
          belowPoverty,
          occupiedHomes,
          vacantHomes,
          homeownerVacany,
          rentalVacany,
          totalPopulation,
          totalHousingUnits,
          householdIncome,
          rentExpense
        ];
      }
    )
    .then(data => {
      $("#population-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Total Population</p></div>
            <div class="stat-value"><p>${formatInteger(
              data[11][1][0]
            )}</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Native Population</p></div>
            <div class="stat-value"><p>%${data[0][1][0]}</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Foreign Population</p></div>
            <div class="stat-value"><p>%${data[1][1][0]}</p></div>
        </div>`);
      $("#education-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Some College</p></div>
            <div class="stat-value"><p>%${data[2][1][0]}</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">In College</p></div>
            <div class="stat-value"><p>%${data[3][1][0]}</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Grad. College</p></div>
            <div class="stat-value"><p>%${data[4][1][0]}</p></div>
        </div>`);
      $("#labor-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Unemployed</p></div>
            <div class="stat-value"><p>%${data[5][1][0]}</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Below Poverty</p></div>
            <div class="stat-value"><p>%${data[6][1][0]}</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Household Inc.</p></div>
            <div class="stat-value"><p>$${formatInteger(
              data[13][1][0]
            )}</p></div>
        </div>`);

      $("#housing-container-1").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Housing Units</p></div>
            <div class="stat-value"><p>${formatInteger(
              data[12][1][0]
            )}</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Occupied Homes</p></div>
            <div class="stat-value"><p>%${data[7][1][0]}</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Vacant Homes</p></div>
            <div class="stat-value"><p>%${data[8][1][0]}</p></div>
        </div>`);
      $("#housing-container-2").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Home Vacancy</p></div>
            <div class="stat-value"><p>%${data[9][1][0]}</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Rental Vacancy</p></div>
            <div class="stat-value"><p>%${data[10][1][0]}</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Rent Expense</p></div>
            <div class="stat-value"><p>$${formatInteger(
              data[14][1][0]
            )}</p></div>
        </div>`);
    })
    .catch(e => {
      console.log(e);
    });
}

function translateLocationCodes(county, state) {
  fetch(
    encodeURI(
      `https://api.census.gov/data/2017/acs/acs1/profile?get=NAME&for=county:${county}&in=state:${state}&key=cd61f085312fedfc60923ae2605d954d1a7e3363`
    )
  )
    .then(response => response.json())
    .then(responseJson => {
      return responseJson[1][0];
    })
    .then(location => {
      getGeoCode(location);
    })
    .catch(e => {
      console.log(e);
    });
}

function getGeoCode(location) {
  const params = {
    key: googleApiKey,
    address: `${location}`
  };

  const queryString = formatQueryParams(params);
  const url = encodeURI(geoCoding_URL + "?" + queryString);

  fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      let location = responseJson.results[0].geometry.location;
      initMap(location);
    })
    .catch(e => {
      console.log(e);
    });
}

function initMap(location) {
  let map, service, infowindow, marker, request;

  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 10
  });
  marker = new google.maps.Marker({ position: location, map: map });
  request = {
    location: location,
    radius: 2000,
    type: ["point of interest"]
  };
  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        $("#results-locations-list").append(
          `<li>${results[i].name}: ${results[i].vicinity}</li>`
        );
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function renderFormAgain() {
  $("#search-button, #results-locations").on("click", function() {
    $(
      "#search-button, .data-head, #map, #results-locations, #container-data"
    ).addClass("hidden");
    $("#js-form, .instructions").removeClass("hidden");
    $(
      "#population-container, #education-container, #labor-container, #housing-container-1, #housing-container-2, #results-locations-list"
    ).empty();
  });
}

function renderLoadScreen() {
  let body = $("body");
  $("form").on("submit", {
    ajaxStart: function() {
      body.addClass(".loading");
    },
    ajaxStop: function() {
      body.removeClass(".loading");
    }
  });
}

function handleSubmit() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    $(
      "#population-container, #education-container, #labor-container, #housing-container-1, #housing-container-2, #results-locations-list"
    ).empty();
    let county = $("#js-search-county").val();
    let state = $("#js-search-state").val();
    translateLocationCodes(county, state);
    getData(county, state);
    $("#js-search-county, #js-search-state").val("");
    $(
      "#results, .data-head, #search-button, #results-locations, #arrow-icon, #map, #container-data"
    ).removeClass("hidden");
    $("#js-form, .instructions").addClass("hidden");
  });
}

$(function() {
  handleSubmit();
  renderFormAgain();
});

// var backgroundImages = [
//   'url(/static/images/slideshow/slide0.jpg)',
//   'url(/static/images/slideshow/slide1.jpg)',
//   'url(/static/images/slideshow/slide2.jpg)',
//   'url(/static/images/slideshow/slide3.jpg)',
//   'url(/static/images/slideshow/slide4.jpg)'
// ],
//   backgroundImageCounter = 0,
//   jumbotron = $('.jumbotron');

// window.setInterval(function () {
//   jumbotron.css('background-image', backgroundImages[backgroundImageCounter]);

//   backgroundImageCounter++;
//   if (backgroundImageCounter >= backgroundImages.length) {
//     backgroundImageCounter = 0;
//   }
// }, 5000);
