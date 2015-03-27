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
    var share = document.querySelector('#share');

    var inputText = '';

    var STOP_WORDS = [
        'of', 'the', 'a', 'in'
    ];

    var historyCache;

    // stub localStorage to avoid errors
    if (!window.localStorage) { window.localStorage = {} };

    if (window.localStorage.dumbagram) {
        historyCache = JSON.parse(window.localStorage.dumbagram);
        if (historyCache.constructor === Array) {
            historyCache = {};
        }
    } else {
        historyCache = {};
    }

    var selectText = function (element) {
        if (document.body.createTextRange) { // ms
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) { // moz, opera, webkit
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
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
        table.querySelector('tbody').appendChild(tr);

        historyCache[items[0]] = items[1];

        if (Object.keys(historyCache).length > 0) {
            historyDiv.classList.remove('hide-all');
        }
    };

    var formSubmit = function (ev) {
        if (ev) { ev.preventDefault(); }

        inputText = input.value.trim();

        if (inputText.length < 1) { return false; }

        share.classList.add('hide-all');

        var res = swapInitials(inputText);
        document.querySelector('#result h1').textContent = res;
        addToHistory([inputText, res]);

        firebase.push({
            original: inputText,
            dumbered: res,
            createdAt: new Date().getTime()
        });

        window.localStorage.dumbagram = JSON.stringify(historyCache);
        input.value = '';
    };

    var hashCallback = function () {
        input.value = decodeURIComponent(window.location.hash.substr(1));
        formSubmit();
    };

    Object.keys(historyCache).forEach(function (key) {
        addToHistory([key, historyCache[key]]);
    });

    if (window.location.hash) { hashCallback(); }

    form.addEventListener('submit', formSubmit);

    document.querySelector('#result').addEventListener('click', function () {
        var shareLink = share.querySelector('a');

        share.classList.remove('hide-all');
        var urlParts = window.location.href.split('#');
        var shareURL = urlParts[0] + '#' + encodeURIComponent(inputText);
        shareLink.href = shareURL;
        shareLink.textContent = shareURL;
        selectText(shareLink);
    });

    document.querySelector('button.orange').addEventListener('click', function () {
        var tableBody = table.querySelector('tbody');
        historyCache = {};
        localStorage.dumbagram = '{}';
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        historyDiv.classList.add('hide-all');
    });
})();
