// freewall global
var wall;

var api_key = 'd9edd8af4c7623dd292b6d5963dcd6d2';

var url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key;
var url_params = "&format=json&nojsoncallback=1&per_page=10";

var url_interestingness = "http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=" + api_key;
var url_interestingness_params = "&per_page=1&format=json&nojsoncallback=1"

var url_getSizes = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&per_page=1&api_key=" + api_key;



/* Called after featured-image has been loaded */
function afterWallBrickImageLoad() {

	wall.container.find('.brick img').on('load', function() {

		// shows the featured image
		$(this).css("opacity" , "1");

		// hides the loading gif
		$(this).parent().prev().hide()

		// forces img to fit container
		wall.fitWidth();
	});
}

/* For the Homepage freewall tiles */
function generateWall(wall) {

	wall.reset({
		selector: '.brick',
		animate: true,

		/* the anonymous function provides a bug fix
		*  when tile articles disappear when on tiny
		*  viewports.
		*/
		cellW: function (width) {
			if (width < 375)
				return 250;
			else if (width < 440)
				return 300;
			else return 350;
		},

		cellH: 'auto',
		delay: 0,
		onResize: function() {
			wall.refresh();
		}
	});

	afterWallBrickImageLoad();
}

function loadWall(page) {
	console.log(page);
	page.forEach(function(unit) {

		$('#results').append(
			'<a href="' + unit.url + '" title="">' +
			    '<div class="brick">' +

			        '<div class="loading-gif">' +
			            '<img src="../images/loader.gif">' +
			        '</div>' +

			        '<div class="tiled-wrapper">' +
			            '<img src="' + unit.url + '">' +
			        '</div>' +

			        '<div class="result-title">' +
			            unit.title +
			        '</div>' +
			    '</div>' +
			'</a>');
	});

	buildWall();
}

/* Loads the first result of Flickr's most interesting photo of the day */
function buildHeader() {

	$.getJSON(url_interestingness + url_interestingness_params, function(result) {

		var img = result.photos.photo[0];

		var title = img.title;
		// $('#photo-of-the-day').html('Photo of the Day: <a href="' + url + '">' + title + '</a>');

		// another AJAX in order to get original img 
		$.getJSON(url_getSizes + '&photo_id=' + img.id, function(result) {

			var url = result.sizes.size[result.sizes.size.length-1].source;
			console.log(url);
			$('#main').css({'background' : 'url(' + url + ') no-repeat center center fixed'});
		});	

	
	
	});
}

function buildWall() {

	// init the wall
	wall = new freewall("#results");

	generateWall(wall);
	wall.refresh();
}

$('document').ready(function() {

	buildHeader();

	$('#btn-submit').click(function(event) {
		event.preventDefault();

		// clears prev results
		$('#results').html("");

		// builds the query to the API: flickr.photos.search
		var query = "&text=" + $("#query").val();
		var URL = url_base + url_params + query;

		$.getJSON(URL, function(result) {
			var images = result.photos;
			console.log(images);

			var page = new Array();

			images.photo.forEach(function(unit) {
				var obj = {}
				obj.url = "https://farm" + unit.farm + ".staticflickr.com/" + unit.server + "/" + unit.id + "_" + unit.secret + ".jpg";	
				obj.title = unit.title

				page[page.length] = obj
			});

			loadWall(page);
		});
	});

	buildWall();
});









