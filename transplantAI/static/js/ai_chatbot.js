// utility functions
function getCustomFormattedTime(date){
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(minutes < 10){
        minutes = '0' + minutes.toString();
    }
    let mid='AM';
    if(hours==0){
        hours=12;
    }
    else if(hours>12){
        hours=hours%12;
        mid='PM';
    }

    return `${hours%13}:${minutes} ${mid}`
}

let chat_id = 0;

function get_latest_chat_id(){
    return chat_id;
}
function get_chatbot_response_template(chatbot_response, chatbot_response_time, c_id) {
    chat_id += 1;
    return `<li class='clearfix'> <div class='message-data text-right'> <span class='message-data-time'>${chatbot_response_time}</span> 
    <img id='loki' src='https://bootdey.com/img/Content/avatar/avatar1.png' alt='avatar'> </div> <div id='${c_id}' class='message other-message float-right'>${chatbot_response}</div> </li>`;
}

let pre_transplant = {
    "name": "Hamilton-17",
    "description": "Hamilton Depression Rating Scale (HAM-D) for assessing symptoms of depression",
    "sections": [
        {
            "number": 1,
            "scale": {
                "Not present": 0,
                "Mild": 1,
                "Moderate": 2,
                "Severe": 3
            },
            "prefix": "Normally,Over the last two weeks, how often have you experienced",
            "questions": [
                "Depressed mood?",
                "Feelings of guilt?",
                "Suicidal thoughts?",
                "Difficulty falling asleep?",
                "Waking during the night?",
                "Waking during early hours of the morning?",
                "Impact on work and activities?",
                "Slowness in movements or speech?",
                "Agitation?",
                "Psychological anxiety?",
                "Physical complaints related to anxiety?",
                "Loss of appetite?",
                "General physical symptoms?",
                "Genital-sexual symptoms (loss of libido, impaired sexual performance, menstrual disturbance)?",
                "Health-related anxiety?",
                "Loss of weight?",
                "Lack of insight?"
            ]
        }
    ],
    "scoring": [
        {
            "section": 1,
            "ranges": [
                [0, 7],
                [8, 17],
                [18, 24],
                [25, 52]
            ],
            "severity": [
                "None or minimal",
                "Mild",
                "Moderate",
                "Severe"
            ],
            "action": [
                "No significant depression",
                "Mild depression (monitor closely)",
                "Moderate depression (consider intervention)",
                "Severe depression (intervention required)"
            ]
        }
    ],
    "source": "TRANSPLANT-AI ",
    "accessed": "2024-03-07"
};

let post_transplant = {
    "name": "Hamilton-17",
    "description": "Hamilton Depression Rating Scale (HAM-D) for assessing symptoms of depression",
    "sections": [
        {
            "number": 1,
            "scale": {
                "Not present": 0,
                "Mild": 1,
                "Moderate": 2,
                "Severe": 3
            },
            "prefix": "After the kidney transplantation, how often have you experienced",
            "questions": [
                "Depressed mood?",
                "Feelings of guilt?",
                "Suicidal thoughts?",
                "Difficulty falling asleep?",
                "Waking during the night?",
                "Waking during early hours of the morning?",
                "Impact on work and activities?",
                "Slowness in movements or speech?",
                "Agitation?",
                "Psychological anxiety?",
                "Physical complaints related to anxiety?",
                "Loss of appetite?",
                "General physical symptoms?",
                "Genital-sexual symptoms (loss of libido, impaired sexual performance, menstrual disturbance)?",
                "Health-related anxiety?",
                "Loss of weight?",
                "Lack of insight?"
            ]
        }
    ],
    "scoring": [
        {
            "section": 1,
            "ranges": [
                [0, 7],
                [8, 17],
                [18, 24],
                [25, 52]
            ],
            "severity": [
                "None or minimal",
                "Mild",
                "Moderate",
                "Severe"
            ],
            "action": [
                "No significant post-transplant care concerns",
                "Mild post-transplant care issues (monitor closely)",
                "Moderate post-transplant care challenges (consider intervention)",
                "Severe post-transplant care complications (intervention required)"
                ]
        }
    ],
    "source": "TRANSPLANT-AI ",
    "accessed": "2024-03-07"
};

let answers = [];

function updateScroll(){
    var element = document.getElementById("chat_container");
    element.scrollTop = element.scrollHeight;
}
// setInterval(updateScroll,100);


let testStarted = false;
let testType = "PRE";
let ind = 0;

function getDepressionRating(type){
    return new Promise(function(resolve, reject) {
        console.log(answers);
        $.post('/getDepressionRating', {answers: answers.join("$"), type: type }, function (sev) {
            console.log(sev);
            resolve(sev);
        });
    });
}


function get_chatbot_message(chatbot_response, user_query) {
    // $.ajax({url: '/ai_chatbot', method: 'POST', async: false, success: function(msg){
    //     console.log(msg);
    //     addResponse(msg);
    // }})
    return new Promise(function(resolve, reject) {

        if(testStarted && user_query != "START"&& user_query != "pre"&& user_query != "post"){
            answers.push(user_query);
        }


        if(testStarted && testType == "PRE"){
            ind += 1;
            if(ind >= 16){
                testStarted = false;
                getDepressionRating("PRE").then(function(sev){
                    console.log("--------------- ", sev);
                    let msg = "Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev.split("$")[0] + "\nAction: " + sev.split("$")[1];
                    updateScroll();
                    $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
                    updateScroll();
                    resolve("Thanks for taking the pre-transplant evaluation test!\nYour depression evaluation severity is: " + sev);
                });
            }
            // if (ind <= 16){
                updateScroll();

                resolve(pre_transplant.sections[0].prefix + pre_transplant.sections[0].questions[ind]);

                updateScroll();

            // }
        }

        if(testStarted && testType == "POST"){
            ind += 1;
            if(ind >= 16){
                testStarted = false;
                getDepressionRating("POST").then(function(sev){
                    console.log("--------------- ", sev);
                    let msg = "Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev.split("$")[0] + "\nAction: " + sev.split("$")[1];
                    updateScroll();
                    $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
                    updateScroll();
                    resolve("Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev);
                });
            }
            // if (ind <= 16){
    updateScroll();

            resolve(post_transplant.sections[0].prefix + post_transplant.sections[0].questions[ind]);
            // }
    updateScroll();

        }

        
        
        if (user_query.toLowerCase() == "start"){
            resolve("Hey!\nDo you want to take the pre-transplant or post-transplant evaluation test?");
        }
        else if (user_query.toLowerCase() == "pre"){
            testStarted = true;
            testType = "PRE";
            if(testStarted){
                ind += 1;
                if(ind >= 16){
                    testStarted = false;
                    getDepressionRating("PRE").then(function(sev){
                    console.log("--------------- ", sev);
                    
                    let msg = "Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev.split("$")[0] + "\nAction: " + sev.split("$")[1];
                    updateScroll();
                    $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
                    updateScroll();
                        resolve("Thanks for taking the pre-transplant evaluation test!\nYour depression evaluation severity is: " + sev);
                    });
                }
                // if (ind <= 16){
    updateScroll();

                    resolve(pre_transplant.sections[0].prefix + pre_transplant.sections[0].questions[ind]);
    updateScroll();

                // }
            }
        }else if (user_query.toLowerCase() == "post"){
            testType = "POST";
            testStarted = true;
            
            if(testStarted){
                ind += 1;
                if(ind >= 16){
                    testStarted = false;
                    getDepressionRating("POST").then(function(sev){
                    console.log("--------------- ", sev);
                    let msg = "Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev.split("$")[0] + "\nAction: " + sev.split("$")[1];
                    updateScroll();
                    $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
                    updateScroll();
                        resolve("Thanks for taking the post-transplant evaluation test!\nYour depression evaluation severity is: " + sev);
                    });
                }
                // if (ind <= 16){
    updateScroll();

                    resolve(post_transplant.sections[0].prefix + post_transplant.sections[0].questions[ind]);
    updateScroll();

                // }
            }
        }else{
            resolve("Test Ended");
        }
    });

}

function getResponse(chatbot_response, query){
    get_chatbot_message(chatbot_response, query).then(function(msg){
        updateScroll();
        $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
        updateScroll();
    }).catch(function(){});
}

// chatbot initialization
$(document).ready(function () {
    if (window.location.href.endsWith("chatbot")){
        $(get_chatbot_response_template("Hey! Ask all your kidney transplantation related questions.", getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
    }else{
        getResponse("", "START");
    }
});


// chatbot response function 
let chatbot_error_response = "Hey we have run into some issuses! Please try again later.";
$("#chatbot_user_input").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        let last_chat_id = get_latest_chat_id() - 1;
        let chatbot_message = $(`#${last_chat_id}`).text();
        let user_query = $("#chatbot_user_input").val();
        let user_query_time = getCustomFormattedTime(new Date($.now()));
        let user_query_template = `<li class='clearfix'> <div class='message-data'> <span class='message-data-time'>${ user_query_time }</span> </div> <div class='message my-message'>${ user_query }</div> </li>`;


        // add the new chat to chat history 
    updateScroll();

        $(user_query_template).appendTo("#chat_history").hide().show('normal');
    updateScroll();

        
        if (window.location.href.endsWith("chatbot")){
            console.log(user_query);
            get__faq_chatbot_message(user_query).then(function(msg){
                updateScroll();
                if(user_query.toLowerCase() == "exit"){
                    $("#chatbot_user_input").attr("disabled", "disabled");
                }else{
                    $(get_chatbot_response_template(msg, getCustomFormattedTime(new Date($.now())), chat_id)).appendTo("#chat_history").hide().show('normal');
                }
                updateScroll();
            }).catch(function(){});
        }else{
            getResponse(chatbot_message, user_query);
        }

    }
});

function get__faq_chatbot_message(user_query) {

    return new Promise(function(resolve, reject) {
        $.post('/chatbot', {user_query: user_query }, function (response) {
            resolve(response);
        });
    });

}