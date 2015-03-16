(function () {
    var form = document.querySelector('form');
    var table = document.querySelector('table');
    var input = form.querySelector('input');

    var STOP_WORDS = [
        'of', 'the', 'a'
    ];

    var historyCache;

    if (window.localStorage.dumbagram) {
        historyCache = JSON.parse(window.localStorage.dumbagram);
    } else {
        historyCache = [];
    }

    var swapInitials = function (s) {
        s = s.split(/\s+/g);

        var division = Math.floor(s.length / 2);
        var last = s.length - 1;

        var tmp = '';

        for (var i = 0; i < division; i++) {
            tmp = s[i][0];

            if (STOP_WORDS.indexOf(s[i].toLowerCase()) !== -1 ||
                STOP_WORDS.indexOf(s[last - i].toLowerCase()) !== -1) continue;

            s[i] = s[last - i][0] + s[i].substring(1);
            s[last - i] = tmp + s[last - i].substring(1);
        }

        return s.join(' ');
    };

    var addToHistory = function (items) {
        var tr = document.createElement('tr');
        tr.innerHTML = [
            '<td class="align-center">' + items[0] + '</td>',
            '<td class="align-center">' + items[1] + '</td>'
        ].join('');
        table.appendChild(tr);
    };

    var formSubmit = function (ev) {
        if (ev) { ev.preventDefault(); }

        var res = swapInitials(input.value);
        document.querySelector('#result h1').textContent = res;
        addToHistory([input.value, res]);
        historyCache.push([input.value, res]);

        if (historyCache.length > 0) {
            document.querySelector('#history').classList.remove('hide-all');
        }
        window.localStorage.dumbagram = JSON.stringify(historyCache);
    };

    var hashCallback = function () {
        input.value = window.location.hash.substr(1);
        formSubmit();
    };

    if (historyCache.length > 0) {
        document.querySelector('#history').classList.remove('hide-all');
    }
    historyCache.forEach(function (item) {
        addToHistory(item);
    });

    if (window.location.hash) { hashCallback(); }
    window.addEventListener('hashchange', hashCallback);

    form.addEventListener('submit', formSubmit);
})();
