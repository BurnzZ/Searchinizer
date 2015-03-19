// freewall global
var wall;

var api_key = 'd9edd8af4c7623dd292b6d5963dcd6d2';

var url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key;
var url_params = "&format=json&nojsoncallback=1&per_page=10";


var pages_total;
var pages_current;
var query;

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

	$('#results').html("");

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

function buildWall() {
	// init the wall
	wall = new freewall("#results");
	generateWall(wall);
	wall.refresh();
}

function buildPagination(current, total) {

	if (current === 1)
		$('#back').css({'display':'none'});
	else
		$('#back').css({'display':'inline-block'});

	if (current === total)
		$('#forward').css({'display':'none'});
	else
		$('#forward').css({'display':'inline-block'});
}

function getData(url, curr) {
	$.getJSON(url + '&page=' + curr, function(result) {
		var images = result.photos;
		var page = new Array();

		console.log(curr);

		if (curr === 1)
			pages_total = result.photos.pages;

		images.photo.forEach(function(unit) {
			var obj = {}
			obj.url = "https://farm" + unit.farm + ".staticflickr.com/" + unit.server + "/" + unit.id + "_" + unit.secret + "_z.jpg";	
			obj.title = unit.title;

			page[page.length] = obj;
		});


		$('#page-tracker').html("Page " + pages_current + ' of ' + pages_total);
		buildPagination(pages_current, result.pages);
		loadWall(page);
	});
}

$('document').ready(function() {

	$('#pagination > div').on('click', function(event) {
		event.preventDefault();

		if (this.id === 'forward')
			getData(url_base + url_params + query, ++pages_current);
		else if (this.id === 'back')
			getData(url_base + url_params + query, --pages_current);
	});

	$('#btn-submit').on('click', function(event) {
		event.preventDefault();

		query = "&text=" + $("#query").val();

		pages_total = 0;
		pages_current = 1;

		getData(url_base + url_params + query, pages_current);

		$('#page-tracker').css({'display' : 'inline-block'});
	});
});









