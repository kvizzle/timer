

$(document).ready(function(){
  var counter = 1;
  var numNewTimers = 0;
  var nameArr = [];
  window.AudioContext = new (window.AudioContext || window.webkitAudioContext)();

  //if('webkitAudioContext' in window) {
   // var audioCtx = new webkitAudioContext();
//}
  
  function newTimerWidget(name){
    this.name = name;
    this.currentTime = 1500000;
    this.millisecondsChanged = 0;
    this.startTimerClicked = false;
    this.reset = false;
    this.pauseClicks = false;
  };

  newTimerWidget.prototype.getTimeObject = function(){
    var minutes = Math.floor((this.currentTime /1000) / 60);
    var seconds = Math.floor((this.currentTime / 1000) % 60);
  
    return {
      'minutes': minutes,
      'seconds': seconds 
    };
  }

  newTimerWidget.prototype.adjustTimer = function(adj){
    this.currentTime += adj;
    if(this.currentTime < 0){
      this.currentTime = 0;
    }
    if (this.startTimerClicked == true){
      this.millisecondsChanged += adj;
    }
  }

  newTimerWidget.prototype.start = function(countDownTime){
    var adjustments = this.millisecondsChanged;
    var updateTimeNow = new Date().getTime();
    var timeRemaining = ((countDownTime + adjustments) - updateTimeNow);
    this.currentTime = timeRemaining;
    if(this.currentTime <= 0){
      this.currentTime = 0;
    }
  }

  newTimerWidget.prototype.pauseTimer = function(){
    this.startTimerClicked = false;
    this.pauseClicks = true;
  }

  newTimerWidget.prototype.resetTimer = function(){
    this.currentTime = 1500000;
    this.millisecondsChanged = 0;
    this.startTimerClicked = false;
    this.reset = true;
    //this.audio.pause();
  }

  function ViewModel(){
     this.name = '';
     this.setName();
  }
  
    ViewModel.prototype.load = function(){
    this.obj = new newTimerWidget(this.name);
    this.curTime = this.obj.getTimeObject();
    this.prettyTime = this.getPrettyTime(this.curTime);  
    this.generateHtml();
    this.clickHandlers(this); 
    this.selectBackground();
  }

  ViewModel.prototype.setName = function(){
    if ($('.name').val() == ''){
      this.name = 'Timer' +'\xa0'+ counter;
      counter++;
    }
    else {
      this.name = $('.name').val();
      $('.name').val('');
    }

    if ((this.name).indexOf(' ') >=0){
      var str = this.name;
      var res = str.replace(/ /g, '\xa0'); 
      this.name = res;
    }

    if (nameArr.indexOf(this.name) >=0){
        alert('You are already timing '+ this.name+'! Please choose a different name.');
    }
      else {
        nameArr.push(this.name);
        this.load();
        numNewTimers++;
      }
  }

  ViewModel.prototype.getPrettyTime = function(object){
    return object.minutes+`<b style='font-size:small'>m </b>${object.seconds}<b style='font-size:small'>s</b>`  
  }
  
  ViewModel.prototype.generateHtml = function(){
      $('.result').append(
      `<div class='col-md-4 col-sm-6 col-lg-4 col-xs-12 text-center'>
        <div id='${this.name}' class='new-timer'>
          <input type='text' class='timer-name text-center' value='${this.name}'></input><br>
          <button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored submit decrease${this.name}' value='-1'> 
            <i class="material-icons">remove</i>
          </button>
          <button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored submit startTimer${this.name}' value='Start Timer'>
            <i class="material-icons">play_circle_outline</i> 
          </button>
          <button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored submit increase increase${this.name}' value='+1'> 
            <i class="material-icons">add</i>
          </button><br><br>
          <div class='adjust adjustDown${this.name}'>
          <button  class='adjustButton decreaseFiveMinutes${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='-300'> 
              -5<small>m</small>
            </button>
            <button  class='adjustButton decreaseOneMinute${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='-60'>
              -1<small>m</small>
            </button>
            <button  class='adjustButton decreaseFiveSeconds${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='-5'> 
              -5<small>s</small>
            </button>
          </div>
          <div class='adjust adjustUp${this.name}'>
            <button class='adjustButton increaseFiveMinutes${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='+300'> 
              +5<small>m</small>
            </button>
            <button  class='adjustButton increaseOneMinute${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='+60'>
              +1<small>m</small>
            </button>
            <button  class='adjustButton increaseFiveSeconds${this.name} mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored' value='+5'> 
              +5<small>s</small>
            </button>
          </div>
          <div id='displayTime${this.name}' class='time-display'>
            ${this.prettyTime}
          </div>
          <button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored submit pause pauseTimer${this.name}' value='Pause'> 
            <i class="material-icons">pause</i>
          </button>
          <button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored submit reset resetTimer${this.name}' value='Reset'> 
            <i class="material-icons">replay</i>
          </button><br>
        </div>
      </div>`);
  }

  ViewModel.prototype.clickHandlers = function(){
    $('.startTimer'+this.name).on('click',{'self':this}, this.startTimer);
    $('.pauseTimer'+this.name).on('click',{'self':this}, this.pauseTimer);
    $('.resetTimer'+this.name).on('click',{'self':this}, this.resetTimer);
    $('.increase'+this.name +', .decrease' +this.name).on('click', {'self':this}, this.addButtons);
    $('.adjustDown'+this.name+', .adjustUp'+this.name).hide();
    $('.increaseFiveSeconds'+this.name+ 
    ', .increaseOneMinute'+this.name+ 
    ', .increaseFiveMinutes'+this.name+ 
    ', .decreaseFiveSeconds'+this.name+ 
    ', .decreaseOneMinute'+this.name+ 
    ', .decreaseFiveMinutes'+this.name).on('click',{'self':this}, this.adjustTimer); 
  }

  ViewModel.prototype.startTimer = function(event){
    var self = event.data.self;
         self.makeSound();
    //self.obj.audio = new Audio('alarm-sound.mp3');
    //self.obj.audio.play();
    var input = this;
    input.disabled = true;
    self.obj.startTimerClicked = true;
    self.obj.pauseClicks = false;
    self.obj.reset = false;
    var countDownTime = (new Date().getTime()+ self.obj.currentTime - self.obj.millisecondsChanged);
      
    var startDelay = setTimeout(function(){
      self.obj.start(countDownTime);
      self.updateTimeDisplay();
    }, 2);
          
    var myVar = setInterval(function(){
      self.obj.start(countDownTime);
      self.updateTimeDisplay();
       
      
      if (self.obj.currentTime <= 0){
        clearInterval(myVar);
        $('.startTimer'+self.name +
        ', .increase'+self.name +
        ', .decrease'+self.name+
        ', .pauseTimer'+self.name).attr('disabled', true);
         self.makeSound();       
      }  

      if (self.obj.reset == true){
        clearInterval(myVar);
        self.resetTimer(event);
      } 

      if (self.obj.pauseClicks == true){
        clearInterval(myVar);
        self.pauseTimer(event);
      } 
    },1000)
  };

  ViewModel.prototype.pauseTimer = function(event){
    var self = event.data.self;
    self.obj.pauseTimer(); 
    $('.startTimer'+self.name).attr('disabled', false);
    self.updateTimeDisplay();
   // $('#'+self.name).remove();
  }

  ViewModel.prototype.resetTimer = function(event){
    var self = event.data.self;
    self.obj.resetTimer();
    $('.startTimer'+self.name +
        ', .increase'+self.name +
        ', .decrease'+self.name+
        ', .pauseTimer'+self.name).attr('disabled', false);
    self.updateTimeDisplay();
  }

  ViewModel.prototype.addButtons = function(event){
    var self = event.data.self;
    if (this.value == +1){
      $.when($('.adjustDown'+self.name).slideUp(500)).then(function(){
        $('.adjustUp'+self.name).slideDown(500);
      });
    }
    else {
      $.when($('.adjustUp'+self.name).slideUp(500)).then(function(){
        $('.adjustDown'+self.name).slideDown(500);
      });
    }
    
    $('#displayTime'+self.name).animate({
      top: '1.2em'
    });
    self.setTimeout(self);  
  }

  ViewModel.prototype.adjustTimer = function(event){
    var self = event.data.self;
    var adj = this.value * 1000;
    self.obj.adjustTimer(adj);
    self.updateTimeDisplay();
  }

  ViewModel.prototype.setTimeout = function(self){
    var x = setTimeout(function(){
      $('.adjustDown'+self.name+' , .adjustUp'+self.name).slideUp(500)
      $('#displayTime'+self.name).animate({
        top: '0em'
      });
    },20000);
  }

  ViewModel.prototype.updateTimeDisplay = function(){ 
    this.curTime = this.obj.getTimeObject();
    $('#displayTime'+this.name).html(this.getPrettyTime(this.curTime));
  }

  ViewModel.prototype.selectBackground = function(){
    //gradients from https://uigradients.com/
    var colors = [{
      background: '-webkit-linear-gradient(left top, #00c6ff, #0072ff)', name: 'facebook-messenger'},{
      background: '-webkit-linear-gradient(left top, #4776E6, #8E54E9)', name: 'electric-violet'}
    ];
    if (numNewTimers%2 == 0){
      $('#'+this.name).css('background', colors[1].background);
    }

    else {
      $('#'+this.name).css('background', colors[0].background);
    }
  }

  ViewModel.prototype.makeSound = function(){
    var counter = 1;
    function generateSound(){   
      if (counter <=5){
        counter++;
        // create Oscillator node
        var oscillator =  window.AudioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 2500; // value in hertz
        oscillator.connect( window.AudioContext.destination);
        oscillator.start();
        oscillator.stop( window.AudioContext.currentTime + 0.1)
        window.setTimeout(generateSound, 120);
      }
    }
    generateSound();
  }
              
  var initialTimer = new ViewModel();
  $('.add').click(function(){
    var additionalTimers = new ViewModel();
  });

  $(".name").keypress(function(e)
  {
    if (e.which == 13)
    {
       var additionalTimers= new ViewModel();
    }
  });
});


// do done
