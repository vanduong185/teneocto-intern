
  day = 10;
  hour = 24;
  min = 60;
  sec = 60;
  total_time = day * hour * min * sec;

  var time = setInterval(function () {
    sec = total_time%60;
    $("#second").text(sec.toString());
    if (total_time == 0) clearInterval(time);
    else {
      min = Math.floor(total_time/60)%60;
      hour = Math.floor(total_time/3600)%24;
      day = Math.floor(total_time/86400);
      
      $("#minute").text(min.toString());
      $("#hour").text(hour.toString());
      $("#day").text(day.toString());
    }
    total_time--;
  }, 1000)