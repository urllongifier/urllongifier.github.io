const linkForm = document.querySelector('form');
const results = document.querySelector('#results');

const deobfuscator = (text, shift = 25565) => {
    const textLength = text.length;
    let deObfText = '';

    for (let i = 0; i < textLength; i += 4) {
        const n = text.substring(i, i + 4);
        const intN = parseInt(n, 16);
        const minusShift = intN - shift - (i / 4);
        const val = String.fromCharCode(minusShift);
        deObfText += val;
    }

    for (let i = 2; i < textLength; i += 2) {
        if (deObfText.substring(0, i / 2) == deObfText.substring(i / 2, i)) {
            return deObfText.substring(0, i / 2);
        }
    }

    return -1;
};

// Using caesar cipher
const obfuscator = (text, shift = 25565, length = 1024) => {
    const textLength = text.length;
    let obfText = '';

    for (let i = 0; i < length / 4; i++) {
        obfText += (text[i % textLength].charCodeAt(0) + shift + i).toString(16).padStart(4, '0');
    }

    return obfText;
};

document.addEventListener("DOMContentLoaded", () => {
    if (document.URL.includes('?')) {
        const currentRedirect = document.URL.split('?')[1];
        console.log('Redirecting to: ', currentRedirect);

        if (currentRedirect.length > 0) {
            const deObfRedirect = deobfuscator(currentRedirect);
            //console.log(deObfRedirect);
            window.location.replace(deObfRedirect);
        }
    }
});

linkForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const currentLink = document.URL
    const wantedLink = linkForm.querySelector('input').value;
    let link = currentLink + '?' + obfuscator(wantedLink);

    // Testing
    // console.log('original: ', wantedLink);
    // console.log('obf: ', obfuscator(wantedLink))
    // console.log('deobf: ', deobfuscator(obfuscator(wantedLink)));

    navigator.clipboard.writeText(link).then(() => {
        results.innerHTML = 'Link has been copied to clipboard';
    }, (err) => {
        results.innerHTML = 'There was an error.';
    });
});