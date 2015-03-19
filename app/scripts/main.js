var wall;

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

$('document').ready(function() {

	// init the wall
	wall = new freewall("#results");
	generateWall(wall);
	wall.refresh();
});