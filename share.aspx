<%@ Page Language="C#" AutoEventWireup="true" CodeFile="share.aspx.cs" Inherits="share" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
    <title>旅人賀卡</title>

    <style type="text/css">
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            background-color: #FDDDCB;
            overflow-y:hidden;
        }

        .noselect {
            cursor: pointer;
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
	                    supported by Chrome and Opera */
        }

        .centerWrapper {
            position: absolute;
            left: 50%;
            top: 50%;
            -ms-transform: translate(-50%,-50%);
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
        }

        img.bg{
            width:100%;
            height:100%;
            object-fit:cover;
        }

        @media only screen and (min-width: 769px) {
            div.content {
                width: 35%;
                height: 80%;
                text-align: center;
            }

            img.card {
                width: 90%;
            }

            img.btnNewCard {
                width: 30%;
            }
        }

        @media only screen and (min-width: 0px) and (max-width: 768px) {
            div.content {
                width: 80%;
                height: 80%;
                text-align: center;
            }

            img.card {
                width: 100%;
            }

            img.btnNewCard {
                width: 50%;
            }
        }
    </style>
</head>
<body>
    <img class="bg" src="assets/img/bg.jpg" />
    <div class="content centerWrapper">
        <img id="card" class="card" src="assets/img/testResult.jpg" />
        <img class="btnNewCard" src="assets/img/btnNewCard.png" onclick="onBtn()"/>
    </div>

    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script>
        var guid = '<% Response.Write(Request.QueryString["guid"]); %>';
        window.onload = function () {
            $("#card").attr('src', "https://happyholidays.china-airlines.com/s/card/" + guid + ".jpg");
        }

        function onBtn()
        {
            window.location = "https://happyholidays.china-airlines.com/";
        }
    </script>
</body>
</html>
