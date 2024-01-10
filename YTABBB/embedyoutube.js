const SEARCH_PARAM_VIDEO_ID_KEY = 'v';
const YOUTUBE_EMBED_URL_PREFIX = 'https://www.youtube.com/embed/';

function makeVideoEmbed(embedUrl, width, height) {
    let embed = document.createElement('iframe');
    embed.setAttribute('src', embedUrl);
    embed.setAttribute('frameborder', '0');
    embed.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    embed.setAttribute('allowfullscreen', true);
    embed.setAttribute('width', width);
    embed.setAttribute('height', height);
    embed.setAttribute('id', 'content');

   return embed;
}

function waitForElem(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function doTheThing() {
    let url = new URL(document.location.href);
    let videoId = new URLSearchParams(url.search).get(SEARCH_PARAM_VIDEO_ID_KEY);
    if(!videoId) {
        // Could be youtube homepage, account page, etc
        return;
    }
    // Remove the adblock not allowed messages
    let blockMessage = await waitForElem('ytd-enforcement-message-view-model');
    blockMessage.remove();
    console.log('Removed block message');

    let embedUrl = `${YOUTUBE_EMBED_URL_PREFIX}${videoId}`;
    let player = document.getElementById('player');
    let embed = makeVideoEmbed(embedUrl, player.offsetWidth, player.offsetHeight);

    // Alternatively:
    player.parentNode.replaceChild(embed, player);
    console.log('Added embedded video');
}

doTheThing();
