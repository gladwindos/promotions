const promoNodes = Array.from(document.querySelectorAll('.promo > span'));
const promoNames = Array.from(new Set(promoNodes.map((elem) => elem.innerText)));

async function fetchPromoCodes(promoNames) {
    try {
        let promoCodes = {}
        await Promise.all(promoNames.map((name) => {
            return fetch(`https://your.uniqodo.com/code.php?promo-name=${name}`)
                .then(res => res.json()
                    .then(data => {
                        promoCodes[name] = data.code;
                    }));
        }));
        return promoCodes;
    } catch (error) {
        console.log(error);
    }
}

const promoCodes = await fetchPromoCodes(promoNames);

function injectPromoCodes(codes) {
    const nodes = document.querySelectorAll('.pull-right > .promo > span, p > .promo');
    const codeNames = Object.keys(codes);
    nodes.forEach((node) => {
        if (codeNames.includes(node.innerText)) {
            node.innerText = codes[node.innerText];
        }
    })
}

injectPromoCodes(promoCodes);


var observer = new MutationObserver(function (mutations, observer) {
    injectPromoCodes(promoCodes);
});

observer.observe(document, {
    subtree: true,
    attributes: true
});