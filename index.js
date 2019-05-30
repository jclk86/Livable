"use strict";

const googleApiKey = "AIzaSyCFlgvXsaF3aL5dJ_KTmlKG3SbqsL2vrb8";
const dataDemographKey = "k_0218e326c3fa2590382dd9482ac43f95";
const usCensusKey = "cd61f085312fedfc60923ae2605d954d1a7e3363";
const usCensus_URL = "https://api.census.gov/data/2017/acs/acs1/profile?";
const dataUSA_URL = "https://datausa.io/api/data?drilldowns=Place&measures=";
const dataDemograph_URL = "https://api.datademograph.com/v1/";
const geoCoding_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const googlePlacesSearch_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function formatInteger(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function getData(county, state) {
  const nativePop = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0087PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const foreignPop = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0092PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const someCollege = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0061PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const inCollege = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0057PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const graduated = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0065PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const unemployed = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0009PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const belowPoverty = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0119PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const occupiedHomes = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0002PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const vacantHomes = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0003PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const homeownerVacancy = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0004E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const rentalVacancy = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0005E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const totalPop = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0078E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const totalHousing = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0006E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const householdInc = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0062E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  const rentExpense = await (await fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0134E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )).json();

  let promiseArray = [
    nativePop,
    foreignPop,
    someCollege,
    inCollege,
    graduated,
    unemployed,
    belowPoverty,
    occupiedHomes,
    vacantHomes,
    homeownerVacancy,
    rentalVacancy,
    totalPop,
    totalHousing,
    householdInc,
    rentExpense
  ];

  Promise.all(promiseArray)
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

function renderLoadingAnimation() {
  setTimeout(() => {
    $("body").removeClass("spinner-3");
    $(
      "#results, .data-head, #search-button, #results-locations, #arrow-icon, #map, #container-data"
    ).removeClass("hidden");
  }, 8000);
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
    $("body").addClass("spinner-3");
    renderLoadingAnimation();
    $("#js-form, .instructions").addClass("hidden");
  });
}

$(function() {
  handleSubmit();
  renderFormAgain();
});
