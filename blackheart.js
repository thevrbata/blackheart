class ClassWatcher {
    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallback = classRemovedCallback
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, {attributes: true})
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if (this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if (currentClassState) {
                        this.classAddedCallback()
                    } else {
                        this.classRemovedCallback()
                    }
                }
            }
        }
    }
};

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

function showCloseBtn() {
    if (document.body.classList.contains('wp-night-mode-on')) {
        close.style.color = '#ffffff';
    } else {
        close.style.color = '#000000';
    }
};

if (getCookie('twitch-widget-hidden') != 'true') {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    } else {
        var widget = document.getElementById('stream-widget');
        var xhr = new XMLHttpRequest();
        var current;

        widget.innerHTML = '<div id="header"><div id="text">Заходи на стрим, дружище! <img draggable="false" role="img" class="emoji" alt="🙂" src="https://s.w.org/images/core/emoji/13.0.1/svg/1f642.svg"></div><span id="close-btn"/></div><div id="frame"></div>';

        var close = document.getElementById('close-btn');

        close.addEventListener('click', function () {
            widget.style.display = 'none';
            widget.innerHTML = '';
            document.cookie = "twitch-widget-hidden=true; max-age=172800; secure; path=/"
        });

        if (document.body.classList.contains('wp-night-mode-on')) {
            close.style.color = '#ffffff';
        }

        var watcher = new ClassWatcher(document.body, 'wp-night-mode-on', showCloseBtn, showCloseBtn)

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
        xhr.setRequestHeader("Authorization", "Bearer 62u4o4dj37ft858ro0ig71m394vqhw");
        xhr.send();
    }
};
