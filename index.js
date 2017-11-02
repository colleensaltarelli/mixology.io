const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_KEY_VALUE = 'AIzaSyCKUPmD5aHfTTzLK-TslE6Nn9WFmWWEksY';


//function to get date from API
function getDataFromApi(searchTerm, callback) {
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

//function to render the results into a html string
function renderResult(result) {
  return `
    <div class="col-6 js-video-thumb-box video-thumb-box">
      <div class="js-video-thumb video-thumb">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${result.id.videoId}" frameborder="0" allowfullscreen></iframe>
        <p class="video-title">${result.snippet.title}</p>
      </div>  
    </div>
  `;
}

//function to loop over the data from the API then join the html srtings and place on the DOM
function displayYouTubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
}


//function to watch for click event and run functions
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    searchTerm = query
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(() => {
  watchSubmit()
});