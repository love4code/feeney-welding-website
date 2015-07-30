/**
 *  Font-swappah..
 *      @author: Michael Rosata
 *   switch fonts using arrow keys, shift key modifier.
 */

WebFontConfig = {
  google: { families: [ 'Yellowtail::latin', 'Just+Another+Hand::latin', 'Parisienne::latin', 'Niconne::latin', 'Lily+Script+One::latin', 'Oleo+Script+Swash+Caps::latin', 'La+Belle+Aurore::latin', 'Yesteryear::latin', 'Marck+Script::latin', 'Lobster::latin', 'Paprika::latin', 'Engagement::latin', 'Grand+Hotel::latin', 'Tangerine::latin', 'Great+Vibes::latin', 'Pacifico::latin', 'Playball::latin', 'Rochester::latin', 'Pinyon+Script::latin', 'Homemade+Apple::latin', 'Berkshire+Swash::latin', 'Dancing+Script::latin', 'Satisfy::latin', 'Courgette::latin', 'Leckerli+One::latin', 'Lobster+Two::latin', 'Sansita+One::latin', 'Kaushan+Script::latin', 'Norican::latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

theFonts = ['Yellowtail', 'Just Another Hand', 'Parisienne', 'Niconne', 'Lily Script One', 'Oleo Script Swash Caps', 'La Belle Aurore', 'Yesteryear', 'Marck Script', 'Lobster', 'Paprika', 'Engagement', 'Grand Hotel', 'Tangerine', 'Great Vibes', 'Pacifico', 'Playball', 'Rochester', 'Pinyon Script', 'Homemade Apple', 'Berkshire Swash', 'Dancing Script', 'Satisfy', 'Courgette', 'Leckerli One', 'Lobster Two', 'Sansita One', 'Kaushan Script', 'Norican' ];

/**
 *  Todo: - Make the font-size effect different elements differently
 *        - Move the google font insert script into object
 *        - Make it simple to pass in fonts and new fonts
 *        - Make it simple to store or export font info
 */
var fontSwappah = (function (window, $, undefined) {
  var _keymap = {
    'up': 38,
    'down': 40,
    'left': 37,
    'right': 39
  };
  var _weights = [100,300,400,500,600,700,800,900];
  var __weights = ['thin', 'light', 'normal', 'medium', 'bold', 'ultra-bold'];

  // Build and append the html console for the plugin
  var fontSwappahConsoleHTML = '<div id="fontSwappahConsole" class="fs-no-s" style="display:none;position:absolute;z-index:999999;top:80px;top:30px;right:50px;"><div class="fontSwrappah" style="width:330px;min-height:34px;border:1px solid #f9fefa;text-align:center;background:#fff;box-shadow:0px 1px 1px 0 #444;color:#454645;"><div class="font-info" style="font-size:19px;"><span class="font-type">--Font Name Here--</span><span class="font-size-weight" style="display: block;"> </span></div></div><section id="fontSwappahCtrl" style="width:330px;min-height:34px;border:1px solid #f9fefa;text-align:center;background:#fff;box-shadow:0px 1px 1px 0 #444;color:#454645;padding:8px;"><label for="fontSizeCtrl">Font Size:</label><input name="fontSizeCtrl" type="range" min="6" max="64" step="1" value=""><label for="fontWeightCtrl">Font Weight:</label><input name="fontWeightCtrl" type="range" min="0" max="0" step="1" value=""><label for="lineHeight">Line Height:</label><span class="fsBtn" aria-role="button" name="lineHeightDown">Lower</span><span class="fsBtn" aria-role="button" name="lineHeightUp">Higher</span><br><label for="lineHeight">Font-Family:</label><span class="fsBtn" aria-role="button" name="fontPrev">Prev</span><span class="fsBtn" aria-role="button" name="fontNext">Next</span></div></div><style>.fsBtn{width:50%;height:28px;border:1px solid #444;background:#cfcfcf;padding:4px;cursor:pointer;display:inline-block;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-bottom:4px;}.fsBtn:hover{background:#ebebeb;} .fs-no-s {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}#fontSwappahConsole label {display: block !important;margin-top:4px;}</style>';
  $('body').append(fontSwappahConsoleHTML);

  return {
    _selector: '.font-swappah',
    _$console: '#fontSwappahConsole',

    init: function (/* array [*/fonts/*]*/) {
      var self = this;
      self.collection = [].concat(fonts);
      self.currentFont = 0;
      self._$console = $(this._$console);
      self.weightsSet = [].concat(_weights);
      self.currentWeight = Math.floor(this.weightsSet.length / 2);
      self.currentFontSize = parseInt($('body').css('fontSize'), 10) || 16;
      // Calculate a safe line-height, no suffix IE: 1.25
      self.currentLineHeight = parseFloat(
          parseInt($('body').css('lineHeight'), 10) / this.currentFontSize).toFixed(3);
      self.isVisible = (this._$console.css('display') != 'none'); // whether console is visible or not
      self._consoleSetupInputs();
      // Create all mouse and keyboard events for the project
      self._setupEvents();
    },

    /**
     * Depending on base fonts, weight sets, the console inputs may need different attributes or start values
     */
    _consoleSetupInputs: function (self){
      if (!self) self = this;
      var $console = self._$console;
      $console.find('input[name="fontWeightCtrl"]').attr('max', self.weightsSet.length-1).val(self.currentWeight);
      $console.find('input[name="fontSizeCtrl"]').val(self.currentFontSize);
    },

    /**
     * Event Handlers to cycle fonts and weights
     */
    _setupEvents: function() {
      var self = this;
      // First setup the mouse over events for the console
      self._$console.hover(
          function() {
            self.showConsole(false);
          }, function() {
            self.hideConsole(1750);
          }
      );
      // Next the mouse click events on the console
      self._$console.on('click.fontSwappah', function(e) {
        self._handleConsoleClicks(self, e);
      });
      // Next the input change events on the console
      self._$console.find('input').on('change', function(e) {
        self._handleInputChange(self, e);
      });
      // Finally the keyboard events
      $(document).on('keyup.fontSwappah', function(e) {
        self._handleKeyboardEvents(self, e);
        // Need to update the console sliders (make sure they stay insync when we change values with keyboard).
        self._consoleSetupInputs(self);
      });
    },

    // Chose the selector to edit fonts for
    selector: function (selector) {
      this._selector = selector;
      this._updateStyles();
    },

    // Update the sites styling to match selected font types
    _updateStyles: function () {
      $(this._selector).css({
        'fontFamily': this.collection[this.currentFont],
        'fontWeight': this.weightsSet[this.currentWeight],
        'lineHeight': this.currentLineHeight,
        'fontSize': this.currentFontSize + 'px',
        'transition' : '.35s all'
      });
    },
    // Set style to the next font in collection
    _fontCycleUp: function () {
      this.currentFont = (++this.currentFont % this.collection.length);
    },

    _fontCycleDown: function () {
      this.currentFont = ( --this.currentFont < 0 ?
          (this.collection.length - 1) : (this.currentFont % this.collection.length) );
    },

    _fontWeightUp: function () {
      this.currentWeight = (++this.currentWeight % this.weightsSet.length);
    },

    _fontWeightDown: function () {
      this.currentWeight = ( --this.currentWeight < 0 ?
          (this.weightsSet.length - 1) : (this.currentWeight % this.weightsSet.length) );
    },

    /**
     * @param [bool] modifier=false - Whether to adjust to alternate change interval
     */
    _fontSizeUp: function (modifier) {
      var interval = modifier ? 5 : 1;
      this.currentFontSize = ( this.currentFontSize + interval);
    },

    /**
     * @param [bool] modifier=false - Whether to adjust to alternate change interval
     */
    _fontSizeDown: function (modifier) {
      var interval = modifier ? 5 : 1;
      this.currentFontSize = Math.max( 5, this.currentFontSize - interval);
    },

    /**
     * @param [bool] modifier=false - Whether to adjust to alternate change interval
     */
    _lineHeightUp: function (modifier) {
      var interval = modifier ? .25 : .05;
      this.currentLineHeight = Math.min(5.0, parseFloat(
              this.currentLineHeight + interval).toFixed(3)
      );
    },

    /**
     * @param [bool] modifier=false - Whether to adjust to alternate change interval
     */
    _lineHeightDown: function (modifier) {
      var interval = modifier ? .25 : .05;
      this.currentLineHeight = Math.max(.1, parseFloat(
              this.currentLineHeight - interval).toFixed(3)
      );
    },

    /**
     * Manage Keyboard clicks
     * @param [object] self - To have reference to fontSwappah context
     * @param [eventObj] e  - Keyboard event object
     */
    _handleKeyboardEvents: function(self, e) {
      // Store the keyCode from current keyup event
      var key = e.keyCode;
      var altKey = e.altKey;
      // Switch to catch specific key presses and take action
      switch (key) {
        // Figure out if we need to handle the key press
        case (_keymap['up']):
          e.preventDefault();
          if (e.shiftKey)
            self._fontWeightUp();
          else
            self._fontSizeUp(altKey);
          // Update the style after modification
          self._updateStyles();
          self.showConsole(1750);
          break;

        // Down, font size and weight down
        case (_keymap['down']):
          e.preventDefault();
          if (e.shiftKey)
            self._fontWeightDown();
          else
            self._fontSizeDown(altKey);
          // Update the style after modification
          self._updateStyles();
          self.showConsole(1750);
          break;

        // font type switch (prev)
        case (_keymap['left']):
          e.preventDefault();
          if (e.shiftKey)
            self._lineHeightDown(altKey)
          else
            self._fontCycleDown();
          self._updateStyles();
          self.showConsole(1750);
          break;

        // font type switch (next)
        case (_keymap['right']):
          e.preventDefault();
          if (e.shiftKey)
            self._lineHeightUp(altKey)
          else
            self._fontCycleUp();
          self._updateStyles();
          self.showConsole(1750);
          break;
        default:
          // No action (for now)
          break;
      } /* End Switch keycode */
    },

    /**
     * Manage Mouse clicks inside fontSwappah Console
     * @param [object] self - To have reference to fontSwappah context
     * @param [eventObj] e  - Keyboard event object
     */
    _handleConsoleClicks: function (self, e) {
      var target;
      if (e.target) target = e.target;
      else if (e.srcElement) target = e.srcElement;

      //var target = e.target || e.srcElement || e.targetElm;
      var target = $(target);

      if (target.length) {
        var targetName = target.attr('name');
        switch (targetName) {
          case 'fontNext':
            // Change to next font
            self._fontCycleUp();
            self._updateStyles();
            break;
          case 'fontPrev':
            self._fontCycleDown();
            self._updateStyles();
            // Change to prev font
            break;
          case 'lineHeightUp':
            // Increase the line height
            self._lineHeightUp();
            self._updateStyles();
            break;
          case 'lineHeightDown':
            // Lower the line height
            self._lineHeightDown();
            self._updateStyles();
            break;
          default:
            // Nothing to do
            break;
        }
        // Unlike keyboard, all our clicks here should make sure console is shown (with no fade either).
        self.showConsole(false);
      }
    },

    /**
     * Manage input change events in console (font-size and font-weight)
     * @param [object] self - To have reference to fontSwappah context
     * @param [eventObj] e  - Change event object
     */
    _handleInputChange: function (self, e) {
    var target;
    if (e.target) target = e.target;
    else if (e.srcElement) target = e.srcElement;

    target = $(target);
    if (target.length) {
      var inputDoes = target.attr('name');
      var inputVal = parseInt(target.val(), 10);
      if (inputDoes == 'fontSizeCtrl' && inputVal) {
        self.currentFontSize = (inputVal);
      }
      if (inputDoes == 'fontWeightCtrl' && inputVal) {
        self.currentWeight = (inputVal);
      }
      self._updateStyles();
      // Unlike keyboard, all our clicks here should make sure console is shown (with no fade either).
      self.showConsole(false);
    }
  },

  // Hide the information about current font style
  hideConsole: function(duration) {
    var $fontConsole = this._$console;
    var self = this;
    duration = duration == undefined ? false : duration;
    // Remove the current timer ID if there is one
    if (this._consoleTimterID) { clearTimeout(this._consoleTimerID);}
    if ($fontConsole.length) {
      // We will create a new timer, unless force is set then just shut it down
      if (!!duration) {
        this._consoleTimerID = setTimeout(function() {
          $fontConsole.fadeOut();
          self.isVisible = false;
        }, parseInt(duration, 10));
      } else {
        // Just fadeOut the console now
        $fontConsole.fadeOut();
        self.isVisible = false;
      }
    }
  },

  // Display info about current font style
  //showConsole: function(/* int [*/duration/*]*/) {
  showConsole: function(/* int [*/duration/*]*/) {
    var self = this;
    // For now, default 1 second max to keep the font swappah console visible
    duration = duration == undefined ? false : duration;
    var $fontConsole = self._$console;
    // Check that the console exists before proceeding
    if ($fontConsole.length) {
      // we want to show the console and set a timeout for it to vanish
      $fontConsole.find('.font-type').text(self.collection[this.currentFont] + ' @ '
      + self.currentFontSize + 'px');
      $fontConsole.find('.font-size-weight').html(
          this.currentLineHeight+ ' <span class="emph"> spacing </span>&nbsp;-&nbsp;'
          + self.weightsSet[this.currentWeight] + ' <span class="emph">weight</span>');

      // We don't want to fadeIn a visible element, and also don't want multiple fadeOuts on timeout
      // clear old timeout if there is one currently setup to fade out the console
      if (self._consoleTimerID){ clearTimeout(this._consoleTimerID); }
      // Now setup a new timeout if duration was passed in. Else then it will be handled elsewhere
      if (self.isVisible && !!duration) {
        // Set console. to timeout again in another "duration"
        self._consoleTimerID = window.setTimeout(function () {
          self.hideConsole();
        }, 200 + parseInt(duration, 10));

      } else {
        // Console not visible yet, so we must fadeIn() the console
        $fontConsole.fadeIn(200);
        self.isVisible = true;
        if (!!duration) {
          // Set timeout to fadeOut() console
          self._consoleTimerID = window.setTimeout(function () {
            self.hideConsole();
          }, 200 + parseInt(duration, 10));
        }
      }
    }
  } /* End of showConsole() */

}; /* End of fontSwappah API*/
}(window, jQuery));

//fontSwappah.init(theFonts);
