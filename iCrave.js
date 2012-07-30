Users = new Meteor.Collection("users");
Events = new Meteor.Collection("events");

if (Meteor.is_client) {

    String.prototype.hashCode = function(){
        var hash = 0, i, char;
        if (this.length == 0) return hash;
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };    

  Validation = {
    clear: function () { 
      return Session.set("error", undefined); 
    },
    set_error: function (message) {
      return Session.set("error", message);
    },
    valid_name: function (name) {
      this.clear();
      if (name.length == 0) {
        this.set_error("Name can't be blank");
        return false;
      } else {
        return true;
      }
    },
    user_exists: function(name) {
      return Users.findOne({user: name});
    }
  };

  var to_time = function(seconds) {
      var mins = Math.floor(seconds / 60);
      var secs = seconds % 60;
      mins = (mins < 10) ? "0" + mins : mins;
      secs = (secs < 10) ? "0" + secs : secs;
      return mins + " : " + secs;
  };
    
  Template.hello.greeting = function () {
    return "Welcome to iCrave.";
  };

  Template.hello.events = {
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  };

  Template.welcome.greeting = function () {
    return "Welcome to iCrave.";
  };

  Template.welcome.points = function () {
    var username = Users.findOne({user: Session.get("user").hashCode()});
    return username && username.points;
  };

  Template.welcome.userExists = function (user) {
    console.log("testooo" + user);
  };

  Template.welcome.events = {
    'click input.userSubmit': function () {
      var user = document.getElementById("userText").value.trim();
      if (Validation.valid_name(user)) {
        if (Validation.user_exists(user)) {
          Session.set("user", user);
        } else {
          var h = user.hashCode();
          Users.insert({user: h, points: 0});
          Session.set("user", user);
        }          
      }
    }
  };

  Template.welcome.error = function () {
    return Session.get("error");
  };

  Template.welcome.user = function () {
    return Session.get("user");
  };


  Template.main.status = function() {
      return Session.get("status");
  };

  Template.main.timer = function (count) {
      $(function (){
            if (count >= 0) {
                var d = $("#counter");
                d.html(to_time(count));
                setTimeout (function() {Template.main.timer(count - 1);}, 1000);
            } else {
                window.alert("CONGRATULATIONS! Challenge Complete!");
                Users.update({user: Session.get("user").hashCode()}, {$inc: {points: 1}});
                Session.set("status", 0);
            }
        });
      
  };

  Template.main.counter = function () {
      return Session.get("counter");
  };

  Template.main.events = {
    'click .clicked': function () {
        Session.set("status", 0);    
    },
    'click .unclicked': function () {
        var d = new Date;
        Events.insert({user: Session.get("user").hashCode(), time: d.toUTCString()});
        Session.set("status", 1);
        Session.set("counter", 1000);        
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
                     
  });
}