(function () {
    var form = document.querySelector('form');
    var table = document.querySelector('table');
    var input = form.querySelector('input');

    var replaceAt = function(str, index, ch) {
        return str.substr(0, index) + ch + str.substr(index + ch.length);
    }

    var swapInitials = function (text) {
        var words = text.split(' ');
        var tmpWord1 = replaceAt(words[0], 0, words[1].charAt(0));
        words[1] = replaceAt(words[1], 0, words[0].charAt(0));
        words[0] = tmpWord1;

        return words.join(' ');
    };

    form.addEventListener('submit', function (ev) {
        if (document.querySelectorAll('td').length < 1) {
            document.querySelector('#results').classList.remove('hide-all');
        }
        ev.preventDefault();
        var res = swapInitials(input.value);
        var tr = document.createElement('tr');
        tr.innerHTML = [
            '<td class="align-center">' + input.value + '</td>',
            '<td class="align-center">' + res + '</td>'
        ].join('');
        table.appendChild(tr);
    });
})();
