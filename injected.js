 //var SERVER_URL = "http://localhost:8080";
        var SERVER_URL = "http://ec2-54-68-142-11.us-west-2.compute.amazonaws.com";

function createJsonResponse() {
    var input;
    var discipline = unifyStr($(".breadcrumbs-list .course-selector-a").text());
    var testId = getCookie("test_id");

    console.log("Test id: " + testId);
    if (testId !== undefined) {

        //$.get("http://dl.tntu.edu.ua/users/profile.php", function (groupData) {
        var responseArr = [];

        //var group = $(groupData).find("input[id=\"group\"]").attr("value");
        var group = getCookie("my_group");
        var elements = $('form[name = \'test\'] fieldset[class=\'group_form\'] > div[class=\'test_instruction\']');


        var responseObject = {};

        responseObject["user"] = $("#header-main-logout-username").text();
        responseObject["testId"] = testId;
        responseObject["group"] = group;
        responseObject["discipline"] = unifyStr(discipline);
        responseObject["moduleName"] = unifyStr($("fieldset[class='group_form'] > legend[class='group_form']").text());

        elements.each(function () {

            if ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined) {

                var object = {};

                var scoresOnTest = $(this).find("div").text();

                //var questionNumber = $(this).find("h3").text();

                var question = $(this).next().find("p").text();

                var elements = $(this).next().find("label");

                var answers = [];
                elements.each(function (index) {
                    answers.push($(this).text().trim());
                });

                object["scoreOnQuestion"] = unifyStr(scoresOnTest);
                object["question"] = unifyStr(question);
                object["answers"] = answers;
                object["answer"] = unifyStr($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").text());


                responseArr.push(object);

            }

        });

        responseObject["body"] = responseArr;

        try {
            var xmlhttp = getXmlHttp();
            xmlhttp.open('POST', SERVER_URL + '/rest/atutor/test/questions', false);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(responseObject));
            if (xmlhttp.status == 200) {
            } else {
            }
        } catch (err) {
            console.log(err);
        }

        return true;

        //});
    }

    return true;

}

 if(document.URL === "http://dl.tntu.edu.ua/users/index.php") {

     //TODO: Get group when user login into website
     var xmlhttpNext = getXmlHttp();
     xmlhttpNext.open('GET', 'http://dl.tntu.edu.ua/users/profile.php', false);
     xmlhttpNext.send(null);
     if (xmlhttpNext.status == 200) {
         var group = $(xmlhttpNext.responseText).find("input[id=\"group\"]").attr("value");
         setCookie("my_group", group, {path: "/", expires : 2232000});
         console.log(group)
     }
 }


var testForm = $("form[name = 'test']")[0];

if (testForm !== undefined) {

    //var submit = $("fieldset[class='group_form'] input[type='submit']");
    var newInput = "<input type='button' id='fakeTestSubmit' class='btn btn-primary' value='Submit'/> ";

    // $("fieldset[class='group_form'] div[class='row buttons']").html($("fieldset[class='group_form'] div[class='row buttons']").html() + newInput);
    function myFunction(event) {
        var html = event.target;

        if(html.getAttribute("type") === "submit") {
             try {
            createJsonResponse();
        } catch (ex) {
            console.log(ex);
        }
        }else{
        }

    }
    document.getElementsByName("test")[0].addEventListener("click", myFunction);

    // $("fieldset[class='group_form'] input[type='submit']").css("display", "none");

    // $("#fakeTestSubmit").click(function () {
    //     try {
    //         createJsonResponse();
    //     } catch (ex) {
    //         console.log(ex);
    //     }

    //     $("fieldset[class='group_form'] input[type='submit']").css("display", "");
    //     $("#fakeTestSubmit").css("display", "none");

    // });
}

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}


function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
    setCookie(name, "", {expires: -1})
}

function unifyStr(str) {
    return str.replace("\r", "").replace("\n", "").replace("\t", "").replace("Балів", "").trim();
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
