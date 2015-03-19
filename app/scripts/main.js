// freewall global
var wall;

var api_key = 'd9edd8af4c7623dd292b6d5963dcd6d2';

var url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key;
var url_params = "&format=json&nojsoncallback=1&per_page=10";



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

function loadWall() {

}

function buildWall() {
	// init the wall
	wall = new freewall("#results");
	generateWall(wall);
	wall.refresh();
}

$('document').ready(function() {

	$('#btn-submit').click(function(event) {
		event.preventDefault();

		var query = "&text=" + $("#query").val();
		var URL = url_base + url_params + query;
		console.log(URL);

		$.getJSON(URL, function(result) {
			var images = result.photos;
			console.log(images);

			images.photo.forEach(function(unit) {
				var photoUrl = "https://farm" + unit.farm + ".staticflickr.com/" + unit.server + "/" + unit.id + "_" + unit.secret + ".jpg";	
			});

			// var photo = result.photos.photo[0];
			// console.log(photo);

			// console.log(photoUrl);
		});
	});

	buildWall();
});









