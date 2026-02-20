"use client"

import {memo, useEffect, useRef} from "react";

const InlineShareButtons = () => {
  const buttons = useRef()

  const config = {
    alignment: 'center',  // alignment of buttons (left, center, right)
    color: 'social',      // set the color of buttons (social, white)
    enabled: true,        // show/hide buttons (true, false)
    font_size: 12,        // font size for the buttons
    labels: "cta",        // button labels (cta, counts, null)
    language: 'vi',       // which language to use (see LANGUAGES)
    networks: [           // which networks to include (see SHARING NETWORKS)
      'facebook',
      'twitter',
      'telegram',
      'reddit',
      'messenger',
      'sharethis'
    ],
    padding: 10,          // padding within buttons (INTEGER)
    radius: 10,            // the corner radius on each button (INTEGER)
    show_total: true,
    size: 40,             // the size of each button (INTEGER)

    // url: currentUrl
  }

  useEffect(() => {
    config.url = window.location.origin + window.location.pathname
    const _onShareThisLoaded = window.onShareThisLoaded;
    const onload = () => {
      if (!onload.complete) {
        if (!config.id) {
          config.id = 'sharethis-' + Date.now();
        }
        if (buttons.current) {
          buttons.current.id = config.id;
          window.__sharethis__.load('inline-share-buttons', config);
        }
        if (_onShareThisLoaded) {
          _onShareThisLoaded();
        }
        onload.complete = true;
      }
    };
    window.onShareThisLoaded = onload;

    if (document.getElementById('sharethis-js')) {
      if (window.__sharethis__) {
        window.onShareThisLoaded();
      }
    } else {
      const script = document.createElement("script");
      script.setAttribute('id', 'sharethis-js');
      const params = {
        property: '672735ad00990500133ed22b',
        product: 'inline-share-buttons',
        source: 'reactjs'
      }
      const query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
      script.src = "https://platform-api.sharethis.com/js/sharethis.js?" + query;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [window.location.pathname]);

  return (
    <div ref={buttons}></div>
  )
}

export default memo(InlineShareButtons);