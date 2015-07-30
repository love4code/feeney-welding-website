$(window).on('load', function (e) {
  var $loader = $('#loader');
  if ($loader.length) {
    // This is how the
    $loader.fadeOut(690);
  }
});

$(document).ready(function() {

  //todo: Remove this in production
  if ('fontSwappah' in window) {
    // If fontSwappah Script has been loaded then we will initialize the plugin so we can test different fonts
    // ---- Uncomment fontSwappah.init(theFonts) to use font swappah (it's setup on the front page header atm).
    //fontSwappah.init(theFonts);
  }

  /**
   * Check if the testimonials is on this page. If so use owl-slider! h00t h00t!
   */
    // Quote Slider
  var testimonals = $("#quote-slider");
  if (testimonals.length) {
    testimonals.owlCarousel({
      navigation: false,
      slideSpeed: 300,
      paginationSpeed: 800,
      singleItem: true,
      stopOnHover: true,
      autoPlay: true
    });

  }

  // Do the testimonial front page switching
  var miniTestimonials = $('.testimonial-item');
  if (miniTestimonials.length) {
    var miniTestimonialsCounter = 1;
    setInterval(function () {
      miniTestimonials.css('display', 'none');
      $(miniTestimonials[ miniTestimonialsCounter % miniTestimonials.length]).fadeIn();
      miniTestimonialsCounter++;
    }, 4000);
  }


  /**
   * Check if we have the masonry elem on the page, if so then we will build the photo gallery.
   * The photo gallery will load each image using Ajax, because all 53 take a long time, especially
   * on a slow server, it's crazy.
   */
  var $feeneyMasonry = $('#feeneyMasonry'),
      feeneyLoader,
      fenceImages,
      $msnry,
      imgCount = 0;

  if ($feeneyMasonry.length) {
    // We know that we are on the portfolio page, so release the page loading icon early
    $loader.fadeOut(690);

    // Make loading image
    feeneyLoader = $('#feeneyLoader');
    // load the images on each fence slide
    fenceImages = $feeneyMasonry.find('img');

    fenceImages.each(function (cur, ind) {
      imgCount++;
      var $curImg = $(this),
          src = $curImg.attr('data-src'),
          tmpImg = new Image();
      tmpImg.onload = function () {
        $curImg.attr('src', this.src);
        imgCount--;
        if (!imgCount) {
          feeneyLoader.fadeOut();
          $('.fence-slide').fadeIn();
          try {
            $feeneyMasonry.masonry();
          } catch (e) {}
        }
      };
      tmpImg.src = src;
    });


    $msnry = $feeneyMasonry.masonry({
      itemsSelector: '.fence-slide'
    });
    $msnry.imagesLoaded(function () {
      $feeneyMasonry.masonry({
        itemsSelector: '.fence-slide'
      });
    });


    // We will store all our items in a jQuery object, outside of event so we will not lose it when scope tries to close
    var collectionItems = $();
    $('body').on('click.feeney', '#masonryControls li', function (evt) {
      evt.preventDefault();
      // We remove the active class on menu items so we can apply to the item just clicked
      $('#masonryControls li').removeClass('active');
      var choosen = $(this).addClass('active').attr('data-shows');

      // If we have a collection of elements, remove any preset items and append the collection
      if (collectionItems.length) {
        $('.fence-slide').remove();
        $feeneyMasonry.append(collectionItems);
        // Now we empty the collection, because the current one dumped in will be removed from the DOM by masonry
        collectionItems = $();
      }
      var fenceSlides = $('.fence-slide');
      $feeneyMasonry.masonry('reloadItems');

      fenceSlides.each(function (cur, ind) {
        var currentSlide = $(this);
        // Get clone of current item (for it will be removed either now, or when this handler is triggered next)
        collectionItems = collectionItems.add($(this).clone());
        // For now, have Masonry remove any item that doesn't match what user is looking for
        if (!currentSlide.hasClass(choosen)) {
          $feeneyMasonry.masonry('remove', this);
        }
      });

      // Trigger the layout to be recalculated
      $feeneyMasonry.masonry();
    });

    // To prevent "Snap-back", where the items in Masonry decrease and upon completion the height of the visible document
    // added to the scroll distance is less than the (scroll distance + height of window), then the page violently snaps
    // up. To prevent that, I make sure that the parent container to Masonry is at least the height of the window itself.
    // Then, I rewrite this style anytime that the window is resized, just to be safe.
    $feeneyMasonry.parent().css('min-height', $(window).height() + 'px');
    $('window').resize(function (evt) {
      $feeneyMasonry.parent().css('min-height', $(window).height() + 'px');
    });
  }


  /**
   * Contact Form.
   */
  var contactForm = $('#contactForm');

  if (contactForm.length) {
    submitBtn = contactForm.find('button[type="submit"]');
    contactForm.find('button[type="submit"]').on('click', function(e) {
      e.preventDefault();
      var form = contactForm.serialize();

      $.ajax({
        url: '/contact-form.php',
        type: 'post',
        data: form,
        dataType: 'json',
        success: function(res) {

          if (res && res.success && res.message) {
            output = '<div><h3>Thank You very much.<\/h3>';
            output += '<p>' + res.message + '<\/p><\/div>';
            contactForm.html(output);
          }
        }
      });
    });
    return false;
  }

  /**
   * Google Map
   *   --- Decided to display at the bottom of each page.
   */
  var mapOnPage = ($('.map').length > 0);
  if (mapOnPage) {
    $(function() {
      var map = new GMaps({
        el: "#map",
        lat: 42.251048,
        lng: -71.130163,
        zoom: 16,
        zoomControl: true,
        scrollwheel: false,
        maxZoom: 16,
        minZoom: 10,
        controls: true,
        zoomControlOpt: {
          position: "TOP_LEFT"
        },
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        overviewMapControl: false,
        styles: [{
          "featureType": "road",
          "elementType": "labels",
          "styles": [{
            "visibility": "simplified"
          }, {
            "lightness": 20
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "landscape.man_made",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [{
            "visibility": "simplified"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "simplified"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [{
            "visibility": "simplified"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{
            "hue": "#a1cdfc"
          }, {
            "saturation": 30
          }, {
            "lightness": 49
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "hue": "#f49935"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "hue": "#fad959"
          }]
        }]
      });

      map.addMarker({
        lat: 42.251048,
        lng: -71.130163,
        icon: "images/feeney-map-icon.png"
      });
    });
  }
  // End Google Map

});


// Scrollspy
$('body').scrollspy({
  target: '.navbar-default'
});



/* I used this to generate a quick template for the images in the masonry grid.
    if this project closes and this is still here... you can delete any of this
    commented out code! NOW, go go go, blue team red, red team blue!
 var feeneyFenceImgs = {
 aluminum: 1,
 castiron: 7,
 chain: 4,
 ornamental: 25,
 pvc: 5,
 wooden: 11
 };
 var dir, tmpSrc, theMasnryGrid = '', i = 1;
 for (i;i<26;i++) {
 for (dir in feeneyFenceImgs) {
 if (feeneyFenceImgs.hasOwnProperty(dir) && i <= feeneyFenceImgs[dir]) {
 tmpSrc = 'images/' + dir + '-fences/original-' + i + '.jpg';
 theMasnryGrid += '<div class="fence-slide ' + dir + '">' +
 '<div class="wrapper">' +
 '<img src="' + tmpSrc + '" />' +
 '</div></div>';
 }
 }

 }
 document.writeln(theMasnryGrid);
 */