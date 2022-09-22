function prioritizeStreamers(streamer, key) {
    switch (streamer['user_name'].toLowerCase()) {
        case 'dunduk':
            current[key]['sort'] = 3;
            break;
        case 'goldencargo':
            current[key]['sort'] = 2;
            break;
        default:
            current[key]['sort'] = 1;
    }
};

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (getCookie('twitch-widget-hidden') != 'true') {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    } else {
        var widget = document.getElementById('stream-widget');
        var xhr = new XMLHttpRequest();
        var current;

        widget.innerHTML = '<div id="header"><span id="close-btn"/></div><div id="frame"></div>';

        var close = document.getElementById('close-btn');

        close.addEventListener('click', function () {
            widget.style.display = 'none';
            widget.innerHTML = '';
            document.cookie = "twitch-widget-hidden=true; max-age=172800; secure; path=/"
        });

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var obj = JSON.parse(this.responseText);
                current = obj.data;
                if (current.length > 0) {
                    current.forEach(prioritizeStreamers);

                    current.sort(function (a, b) {
                        return a.sort - b.sort;
                    })

                    var content = '<iframe src="https://player.twitch.tv/?channel=' + current[0]['user_name'] + '&autoplay=true&muted=true&parent=tarkov.help" ' +
                        'height="200" width="350" allowfullscreen="true"></iframe>';
                    var frame = document.getElementById('frame');
                    frame.innerHTML = content;

                    widget.style.display = 'block';
                }
            }
        });

        xhr.open("GET", "https://api.twitch.tv/helix/streams/?user_login=dunduk&user_login=theblindshogun&user_login=goldencargo");
        xhr.setRequestHeader("Client-ID", "jft4xbv83d62uoh24r6kli5lwz674m");
        xhr.setRequestHeader("Authorization", "Bearer 9owutv3tor1jvpjd2uqvqvkjhji3et");
        xhr.send();
    }
};
