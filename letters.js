// Envelope letters: time-gated love letters, shown in an envelope overlay
// on the unlock day, then collected forever in the album (letters.html).
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('envelopeOverlay');
    const envelope = document.getElementById('envelope');
    const letterView = document.getElementById('letterView');
    const letterTitle = document.getElementById('letterTitle');
    const letterBody = document.getElementById('letterBody');
    const letterClose = document.getElementById('letterClose');
    const kissHeart = document.getElementById('kissHeart');
    const albumLink = document.getElementById('albumLink');
    const lettersGrid = document.getElementById('lettersGrid');
    const emptyNote = document.getElementById('emptyNote');

    const onAlbumPage = !!lettersGrid;

    function sameDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth() === b.getMonth() &&
               a.getDate() === b.getDate();
    }

    function fillLetter(letter) {
        letterTitle.textContent = letter.title;
        letterBody.innerHTML = '';
        letter.body.split('\n\n').forEach(part => {
            const p = document.createElement('p');
            // preserve single line breaks (e.g. the signature) inside a paragraph
            part.split('\n').forEach((line, i) => {
                if (i > 0) p.appendChild(document.createElement('br'));
                p.appendChild(document.createTextNode(line));
            });
            letterBody.appendChild(p);
        });
    }

    function openLetterView(letter) {
        fillLetter(letter);
        overlay.classList.remove('hidden');
        envelope.parentElement.classList.add('hidden');
        letterView.classList.remove('hidden');
    }

    function closeWithKiss() {
        // The letter folds into a heart and is blown, like a kiss, toward the album.
        letterView.classList.add('hidden');
        kissHeart.classList.remove('hidden');
        kissHeart.classList.add('fly');
        // keep the query string so ?preview carries into the album
        setTimeout(() => { window.location.href = 'letters.html' + location.search; }, 1100);
    }

    fetch('messages.json')
        .then(r => r.json())
        .then(data => {
            const now = new Date();
            // ?preview shows everything regardless of unlock time (for testing)
            const preview = new URLSearchParams(location.search).has('preview');
            const letters = (data.envelopeLetters || [])
                .map(l => ({ ...l, unlockDate: new Date(l.unlock) }));
            const unlocked = letters.filter(l => preview || now >= l.unlockDate);

            if (onAlbumPage) {
                if (unlocked.length === 0) {
                    emptyNote.classList.remove('hidden');
                    return;
                }
                unlocked.forEach(letter => {
                    const card = document.createElement('button');
                    card.className = 'album-card';
                    const dateStr = letter.unlockDate.toLocaleDateString('en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' });
                    card.innerHTML =
                        '<span class="album-env">&#128140;</span>' +
                        '<span class="handwriting album-title"></span>' +
                        '<span class="album-date"></span>';
                    card.querySelector('.album-title').textContent = letter.title;
                    card.querySelector('.album-date').textContent = dateStr;
                    card.addEventListener('click', () => openLetterView(letter));
                    lettersGrid.appendChild(card);
                });
                // on the album, closing just returns to the grid — no redirect
                letterClose.addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    letterView.classList.add('hidden');
                });
                return;
            }

            // --- index page ---
            if (albumLink && unlocked.length > 0) {
                albumLink.classList.remove('hidden');
                albumLink.href = 'letters.html' + location.search;
            }

            const todays = unlocked.find(l => preview || sameDay(l.unlockDate, now));
            if (!todays || !overlay) return;

            // once she has opened it, later visits go straight to the page
            // (the album button stays in the corner); preview always shows it
            const openedKey = 'letterOpened_' + todays.unlock;
            if (!preview && localStorage.getItem(openedKey)) return;

            overlay.classList.remove('hidden');
            envelope.addEventListener('click', () => {
                if (envelope.classList.contains('open')) return;
                envelope.classList.add('open');
                localStorage.setItem(openedKey, '1');
                setTimeout(() => {
                    envelope.parentElement.classList.add('hidden');
                    fillLetter(todays);
                    letterView.classList.remove('hidden');
                }, 1450);
            }, { once: true });

            letterClose.addEventListener('click', closeWithKiss);
        })
        .catch(err => console.error('Failed to load letters:', err));
});
