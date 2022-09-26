class ovIframe {

    iframe_interaction = 1;

    _widget;

    _modal;

    _loader;

    _style;

    _closeBtn;

    _iframe;

    // constructor() {
    //     this._createStyles();
    // }

    createPay(data, onSuccess, onFail) {

        this.iframe_interaction = data.iframe_interaction;

        this._initWidget();

        fetch('https://my.onevision.kz/v1/iframe/payment', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                return response.json();
            })
            .then(responseData => {

                this._createIframe(responseData.url);

                this._listener(onSuccess, onFail);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    _initWidget() {
        document.body.style.overflow = 'hidden';

        this._widget = document.getElementById('vision-widget');
        if (typeof this._widget === 'undefined' || this._widget === null) {

            this._createWidget();
            this._createLoader();
            // this._createStyles();
            this._createModal();
            this._createCloseBtn();

            console.log("OneVision payment widget added to html!");
        } else {
            this._widget.style.display = 'block';
        }
    }

    _createWidget() {
        this._widget = document.createElement("div");
        this._widget.id = "vision-widget";
        this._widget.className = "vision-widget";
        document.body.appendChild(this._widget);
    }

    // _createStyles() {
    //     this._style = document.createElement("style");
    //     this._style.appendChild(document.createTextNode(this._cssCode));
    //     document.head.appendChild(this._style);
    // }

    _createModal() {
        this._modal = document.createElement("div");
        this._modal.className = "vision-widget__modal";
        this._widget.appendChild(this._modal);
    }

    _createLoader() {
        this._loader = document.createElement("div");
        this._loader.className = "vision-widget__loader";
        this._widget.appendChild(this._loader);
    }

    _createCloseBtn() {
        if (this.iframe_interaction == 1) {
            this._closeBtn = document.createElement('button');
            this._closeBtn.id = "vision-widget__close";
            this._closeBtn.className = "vision-widget__close";
            this._modal.appendChild(this._closeBtn);
            this._closeBtn.onclick = () => {
                this._widget.style.display = 'none';
                this._modal.style.display = 'none';
                this._loader.style.display = 'block';
                document.body.style.overflow = 'auto';
                this._iframe.remove();
            };
        };
    }

    _createIframe(url) {
        this._loader.style.display = 'block';
        this._iframe = document.createElement("iframe");
        this._iframe.src = url;
        this._iframe.id = "vision-widget__content";
        this._iframe.onload = () => {
            setTimeout(() => {
                this._loader.style.display = 'none';
                this._modal.style.display = 'block';
            }, 50);
        };
        this._modal.appendChild(this._iframe);
    }

    _listener(onSuccess, onFail) {

        window.addEventListener('message', function (event) {
            switch (event.data.status) {
                case 'success':
                    onSuccess.onSuccess(event.data);
                    break;
                case 'error':
                    onFail.onFail(event.data);
                    break;
                default:
                    alert("Ошибка отправки данных");
            }
        });
    }
}

(function (window) {
    'use strict';
    console.log("v7");
    function iframeLibrary() {
        var _iframeLibraryObject = new ovIframe();
        return _iframeLibraryObject;
    }

    if (typeof (window.iwOneVision) === 'undefined') {
        window.iwOneVision = iframeLibrary();
    }
})(window);