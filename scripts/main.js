(function () {
    var form = document.querySelector('form');
    var table = document.querySelector('table');
    var input = form.querySelector('input');

    var STOP_WORDS = [
        'of', 'the', 'a'
    ];

    var swapInitials = function (s) {
        s = s.split(/\s+/g);

        var division = Math.floor(s.length / 2);
        var last = s.length - 1;

        var tmp = '';

        for (var i = 0; i < division; i++) {
            tmp = s[i][0]

            if (STOP_WORDS.indexOf(s[i].toLowerCase()) !== -1
                || STOP_WORDS.indexOf(s[last - i].toLowerCase()) !== -1) continue;

            s[i] = s[last - i][0] + s[i].substring(1)
            s[last - i] = tmp + s[last - i].substring(1)
        }

        return s.join(' ');
    }

    form.addEventListener('submit', function (ev) {
        if (document.querySelectorAll('td').length < 1) {
            document.querySelector('#history').classList.remove('hide-all');
        }
        ev.preventDefault();
        var res = swapInitials(input.value);
        document.querySelector('#result h1').textContent = res;
        var tr = document.createElement('tr');
        tr.innerHTML = [
            '<td class="align-center">' + input.value + '</td>',
            '<td class="align-center">' + res + '</td>'
        ].join('');
        table.appendChild(tr);
    });
})();
