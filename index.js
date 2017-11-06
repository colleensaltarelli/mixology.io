const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_KEY_VALUE = 'AIzaSyCKUPmD5aHfTTzLK-TslE6Nn9WFmWWEksY';
const YUMMLY_ID_SEARCH_URL = 'https://api.yummly.com/v1/api/recipes';
const YUMMLY_RECIPE_SEARCH_URL = 'https://api.yummly.com/v1/api/recipe/';
const YUMMLY_KEY_VALUE = 'efa26fd562d5dd3b3356693fc7a47614';
const YUMMLY_ID_VALUE = '2fdc1bfa';

//function to get date from YouTube API
function getDataFromYouTubeApi(searchTerm, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      key: YOUTUBE_KEY_VALUE,
      q: `how to make a ${searchTerm} cocktail`,
      maxResults: '1',
      type: 'video',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

//function to get ID data from Yummly API
function getIDDataFromYummlyApi(searchTerm, callback) {
    const settings = {
        url: YUMMLY_ID_SEARCH_URL,
        data: {
          _app_key: YUMMLY_KEY_VALUE,
          _app_id: YUMMLY_ID_VALUE,
          q: `${searchTerm} cocktail`,
          maxResult: '1',
          allowedCourse:`course^course-Cocktails`,
          allowedCourse:`course^course-Beverages`,
          excludedCourse: `course^course-Appetizers`,
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
      };
    $.ajax(settings);
  }

  //function to get Recipe data from Yummly API
function getRecipeDataFromYummlyApi(recipeID, callback) {
    const settings = {
        url: YUMMLY_RECIPE_SEARCH_URL + recipeID,
        data: {
          _app_key: YUMMLY_KEY_VALUE,
          _app_id: YUMMLY_ID_VALUE,
          maxResult: '1',
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
      };
    $.ajax(settings);
  }

//function to render the YouTube results into a html string
function renderYouTubeResult(result) {
  return `
    <div class="js-video-thumb-box video-thumb-box">
      <div class="js-video-thumb video-thumb">
          <iframe  role="presentation" title="video"  aria-label="video" src="https://www.youtube.com/embed/${result.id.videoId}" frameborder="0" allowfullscreen></iframe>
        <p class="video-title">${result.snippet.title}</p>
      </div>  
    </div>
  `;
}

//Identify the ingredient list length and loop thru the array 
function renderYummlyIndregients(result) {
  return result.ingredientLines.map((item) => `<li class="single-ingredient">${item}</li>`).join('');
}

//function to render the Yummly results into a html string
function renderYummlyResult(result) {
    const indredientList = renderYummlyIndregients(result);
    return `
      <div class="js-recipe-box recipe-box">
        <div class="js-recipe recipe">
          <h2 class="recipe-name">${result.name}</h2>
          <h3 class="ingredient-title">Ingredients</h3>
          <ul class="ingredient-list">
          ${indredientList}
          </ul>
          <a class="btn try-again full-recipe" href="${result.attribution.url}" target="_blank">View Full Recipe</a>
          <span class="yummly-attribution">${result.attribution.html}</span>
        </div>  
      </div>
    `;
  }

//function to loop over the data from the API then join the html srtings and place on the DOM
function displayYouTubeSearchData(data) {
  const youTubeResults = data.items.map((item, index) => renderYouTubeResult(item));
  $('.js-youtube-search-results').html(youTubeResults);
}

// on click event to check is page is hidden, if not change the class on page to 'hidden', remove the hidden class from page. 
function showPanel(panel) {
  $('.js-panel').removeClass('active');
  $(panel).addClass("active");
}
showPanel('.js-search-page');

//add animation classes to results area
function addAnimation(panel) {
  $(panel).addClass("animated slideInUp");
}

//function to loop over the data from the API then get the recipe ID
function yummlyIDSearchData(data) {
  if (!data.matches.length) {
    showPanel('.js-no-results-page');
  }
  else {
    console.log(data);
    getRecipeDataFromYummlyApi(data.matches[0].id, displayYummlyRecipeSearchData);    
    showPanel('.js-results-page');
    addAnimation('.js-results-area');
  }
}

//function to loop over the data from the API then join the html srtings and place on the DOM
function displayYummlyRecipeSearchData(data) {
    console.log('RENDER', data);
    $('.js-yummly-search-results').html(renderYummlyResult(data));
  }

//function to watch for click event and run functions
$( ".js-try-again" ).on('click', function(event) {
  showPanel('.js-search-page');
});

//function to watch for click event and run functions
$( ".js-search-again" ).on('click', function(event) {
  showPanel('.js-search-page');
});

//function to watch for click event and run functions
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    searchTerm = query
    queryTarget.val("");
    getDataFromYouTubeApi(query, displayYouTubeSearchData);
    getIDDataFromYummlyApi(query, yummlyIDSearchData);
  });
}

$(watchSubmit);
