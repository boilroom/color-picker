$('.slider__line').slider({

  max: 255,
  range: 'min',
  value: 127,
  slide: function(event, ui) {

    const sliderVal = ui.value,
          state = getState();

    state[state.mode][state.colorChannel.toLowerCase()] = sliderVal;

    setState(state);

  }

});

$('input[type="radio"]').checkboxradio({

  icon: false

}).on("change", function(event){

  const mode = $(event.target).val(),
        state = getState();

  state.mode = mode;
  setState(state);

});

$('select[name="colorChannel"]').selectmenu({

  change: function(event, ui) {

    const state = getState();

    state.colorChannel = ui.item.value;
    setState(state);

  }

});

$('.demo-results__channel').on('click', function() {

  const mode = $(this).data('mode'),
        colorChannel = $(this).data('channel'),
        state = getState();

  state.mode = mode;
  state.colorChannel = colorChannel;

  setState(state);

});

setState({

  mode: 'textColor',
  colorChannel: 'R',
  textColor: {

    r: 230,
    g: 230,
    b: 190

  },
  bgColor: {

    r: 115,
    g: 105,
    b: 125

  },

});


function setState(stateData) {

  const prevState = $('.app').data('state') || {};

  if (prevState.mode !== stateData.mode) {  // Изменение объекта изменения цвета (текст или фон)

    const radioButtons = $('.radio-buttons').find('input[type="radio"]'),
          activeRadioButton = radioButtons.filter('input[value="'+stateData.mode+'"]');

    radioButtons.prop('checked', false);

    activeRadioButton.prop('checked', true);

    radioButtons.checkboxradio('refresh');

  }

  if (prevState.colorChannel !== stateData.colorChannel) {  // Изменение редактируемого канала цвета

    const channelSelect = $('select[name="colorChannel"]'),
          channelSelectOptions = channelSelect.find('option');

    channelSelectOptions.prop('selected', false);
    channelSelectOptions.filter('option[value="'+stateData.colorChannel+'"]').prop('selected', true);
    channelSelect.selectmenu('refresh');

    $('.slider').removeClass('slider__mode_R slider__mode_G slider__mode_B');
    $('.slider').addClass('slider__mode_'+stateData.colorChannel);
    $('.slider__info').text(stateData.colorChannel.toUpperCase());

  }

  const textColor = rgbToHex(stateData.textColor.r, stateData.textColor.g, stateData.textColor.b),
        bgColor = rgbToHex(stateData.bgColor.r, stateData.bgColor.g, stateData.bgColor.b);

  $('.demo-results__color-value_text-color').text(textColor);
  $('.demo-results__color-value_bg-color').text(bgColor);

  $('.demo-results__example').css({

    'background': bgColor,
    'color': textColor,

  });

  $('.demo-results__color-demo_text-color').css('background', textColor);
  $('.demo-results__color-demo_bg-color').css('background', bgColor);

  const currentSliderVal = stateData[stateData.mode][stateData.colorChannel.toLowerCase()];

  $('.slider__line').slider('value', currentSliderVal);
  $('.slider__label_current-value').text(currentSliderVal);

  for (let index in stateData.textColor) {

    const channelVal = stateData.textColor[index];

    $('.demo-results__channel[data-mode="textColor"][data-channel="'+index.toUpperCase()+'"]').text(channelVal);

  }

  for (let index in stateData.bgColor) {

    const channelVal = stateData.bgColor[index];

    $('.demo-results__channel[data-mode="bgColor"][data-channel="'+index.toUpperCase()+'"]').text(channelVal);

  }

  $('.demo-results__channel').removeClass('demo-results__channel_on');
  $('.demo-results__channel[data-mode="'+stateData.mode+'"][data-channel="'+stateData.colorChannel+'"]').addClass('demo-results__channel_on');

  console.log($('.demo-results__channel[data-mode="'+stateData.mode+'"][data-channel="'+stateData.colorChannel+'"]'));

  $('.app').data('state', stateData);

}

function getState() {

  const stateClone = JSON.parse(JSON.stringify($('.app').data('state')));

  return stateClone;

}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}