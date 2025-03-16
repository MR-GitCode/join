let contentRef;

function init() {
    toggleLoadingSpinner();
    loadingSpinner();
    loadData();
    toggleLoadingSpinner();
};


function toggleDNone(id) {
    document.getElementById(id).classList.toggle('d_none')
};

function noBubbling(event) {
    event.stopPropagation()
};

function setContentRef(elementID) {
    contentRef = document.getElementById(elementID);
    contentRef.innerHTML = '';
};

function toggleLoadingSpinner() {
    toggleDNone('startpage-logo-container');
    setContentRef('startpage-logo-container');
};

function loadingSpinner() {
    contentRef.innerHTML += getLoadingSpinnerTemplate();
};