class Bloodboil {
    cookieName = 'twitch-widget-hidden';
    // Порядок показа стримеров (больше ключ - ниже приоритет)
    streamerOrder = [
        'tarkovhelp',
        'theblindshogun',
        'dunduk'
    ];

    constructor(id) {
        this.id = id;

        if (this.getCookie() != 'true') {
            // Не показываем на мобильных устройствах
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            } else {
                let initDom = this.initDOM.bind(this);
                let initListeners = this.initListeners.bind(this);
                this.checkOnline().then(function(streamerName) {
                    if (streamerName.length > 0) {
                        initDom();
                        let frame = document.getElementById('frame');
                        frame.innerHTML = '<iframe src="https://player.trovo.live/embed/player?streamername=' + streamerName + '&muted=1&autoplay=1&hidefollow=1&hidesub=1" height="200" width="350" allowfullscreen="true"></iframe>';
                        initListeners();
                    }
                })
            }
        }
    }

    getCookie() {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + this.cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setCookie() {
        document.cookie = this.cookieName + "=true; max-age=172800; secure; path=/";
    }

    async checkOnline() {
        for (const streamer of this.streamerOrder) {
            let myHeaders = new Headers();
            myHeaders.append("Client-ID", "7c5066daa26a52998c95152dad2931a7");
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify({
                "username": streamer
            });

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            let online = await this.fetchData(requestOptions);
            if (online === true) {
                return streamer;
                break;
            }
        }
        return false;
    }

    async fetchData(requestOptions)
    {
        const response = await fetch("https://open-api.trovo.live/openplatform/channels/id", requestOptions);
        const streamerInfo = await response.json();

        return streamerInfo.hasOwnProperty('is_live') && streamerInfo.is_live === true;
    }

    initDOM() {
        this.widget = document.getElementById(this.id);
        this.widget.innerHTML = '<div id="header"><span id="close-btn"/></div><div id="frame"></div>';
        this.widget.style.display = 'block';
    }

    initListeners() {
        let setCookie = this.setCookie.bind(this);
        let widget = this.widget;
        var close = document.getElementById('close-btn');
        close.addEventListener('click', function () {
            widget.style.display = 'none';
            widget.innerHTML = '';
            setCookie();
        });
    }
}

let TrovoPlayer = new Bloodboil('stream-widget');

