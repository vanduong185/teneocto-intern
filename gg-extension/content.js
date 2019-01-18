chrome.runtime.onMessage.addListener( function(msg, sender, response) {
  if (msg.from == "popup" && msg.subject == "UserInfo") {
    console.log(msg.acc_id);
    acc_id = msg.acc_id;
    avatar_tag = document.getElementById("profile_pic_header_" + acc_id);
    name_tag = document.getElementsByClassName("_1vp5")[0];

    if (avatar_tag && name_tag) {
      response({
        message: "done", 
        avatar: avatar_tag.src,
        username: name_tag.textContent
      })
    }
    else {
      response({
        message: "empty"
      })
    }
  }
}) 
