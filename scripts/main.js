(function () {
    var firebase = new Firebase('https://blistering-torch-7660.firebaseio.com/');
    var fbErrors = new Firebase('https://blistering-torch-7660.firebaseio.com/errors');

    window.onerror = function (errorMsg, url, lineNumber) {
        fbErrors.push({ message: errorMsg, url: url, line: lineNumber });
    }

    var form = document.querySelector('form');
    var table = document.querySelector('table');
    var input = form.querySelector('input');
    var historyDiv = document.querySelector('#history');

    var STOP_WORDS = [
        'of', 'the', 'a', 'in'
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

    var itemInHistory = function (item) {
        for (var i=0; i<historyCache.length; i++) {
            if (historyCache[i].join('') === item.join('')
                && historyCache.length > 1) {
                return true;
            }
            return false;
        }
    };

    var addToHistory = function (items) {
        if (itemInHistory(items)) { return; }

        var tr = document.createElement('tr');
        tr.innerHTML = [
            '<td class="align-center">' + items[0] + '</td>',
            '<td class="align-center">' + items[1] + '</td>'
        ].join('');
        table.appendChild(tr);

        historyCache.push(items);

        if (historyCache.length > 0) {
            historyDiv.classList.remove('hide-all');
        }
    };

    var formSubmit = function (ev) {
        if (ev) { ev.preventDefault(); }

        var res = swapInitials(input.value);
        document.querySelector('#result h1').textContent = res;
        addToHistory([input.value, res]);

        firebase.push({
            original: input.value,
            dumbered: res,
            createdAt: new Date().getTime()
        });

        window.localStorage.dumbagram = JSON.stringify(historyCache);
    };

    var hashCallback = function () {
        input.value = decodeURIComponent(window.location.hash.substr(1));
        formSubmit();
    };

    historyCache.forEach(function (item) {
        addToHistory(item);
    });

    if (window.location.hash) { hashCallback(); }

    form.addEventListener('submit', formSubmit);

    document.querySelector('button.orange').addEventListener('click', function () {
        historyCache = [];
        delete localStorage.dumbagram;
        historyDiv.classList.add('hide-all');
    });
})();
