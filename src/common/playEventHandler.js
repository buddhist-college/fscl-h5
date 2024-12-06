/* eslint-disable  */

let postData = () => {}

/**
 * @param {HTMLMediaElement} mediaEl
 * @param {Object} [mediaInfo]
 * @param {string} [mediaInfo.mediaSrc]
 * @param {'hls' | 'video' | 'audio'} [mediaInfo.mediaProvider]
 * @param {(data: any) => void} [dataPostCallback]
 * @returns
 */
function addPlayEvent(mediaEl, mediaInfo = {}, dataPostCallback = () => {}) {
    if (mediaEl) {
        removePlayEvent()
        mediaEl.setAttribute('data-originsrc', mediaInfo.mediaSrc || mediaEl.currentSrc)
        mediaEl.setAttribute('data-playersmarkers', '-1')
        mediaEl.setAttribute('data-playerprovider', mediaInfo.mediaProvider || mediaEl.tagName.toLowerCase())
        mediaEl.addEventListener("play", eventHandler, false)
        mediaEl.addEventListener("pause", eventHandler, false)
        mediaEl.addEventListener("ended", eventHandler, false)
        mediaEl.addEventListener("timeupdate", eventHandler, false)

        postData = async function (data = {}, url = "https://work.hwadzan.org/api/hwadzan/v2/stats/html5video") {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const json = await response.json()
            console.log(json)
            dataPostCallback(json)
            return json;
        }
    }
}

function removePlayEvent(mediaEl) {
    if (mediaEl) {
        mediaEl.removeEventListener("play", eventHandler, false)
        mediaEl.removeEventListener("pause", eventHandler, false)
        mediaEl.removeEventListener("ended", eventHandler, false)
        mediaEl.removeEventListener("timeupdate", eventHandler, false)
    }
}

function eventHandler(e) {
    let data;

    let video_src = typeof e.target.dataset.originsrc !== 'undefined' ? e.target.dataset.originsrc : e.target.currentSrc;
    let video_title = video_src.split('?')[0].split('/')[video_src.split('?')[0].split('/').length - 1] == "playlist.m3u8" ? decodeURIComponent(video_src.split('?')[0].split('/')[video_src.split('?')[0].split('/').length - 2].replace("smil:", "").replace(".smil", "")) : decodeURIComponent(video_src.split('?')[0].split('/')[video_src.split('?')[0].split('/').length - 1]);
    // video_title 沒有擴展名的認為是直播
    let live = video_title.split('.').length > 1 ? false : true;
    const video_provider = e.target.dataset.playerprovider === 'hls' ? 'hls.js player' : `html5 ${e.target.dataset.playerprovider} player`

    switch (e.type) {
        // This event is fired when user's click on the play button
        case 'play':
            data = {
                "event": "html5_video",
                "video_status": "Play",
                "video_title": video_title,
                "video_src": video_src,
                "video_percent": live ? Math.floor(e.target.currentTime) + 's' : Math.floor(e.target.currentTime * 100 / e.target.duration) + '%',
                "video_position": Math.floor(e.target.currentTime),
                "video_duration": Math.floor(e.target.duration),
                "video_page_url": window.location.href,
                "video_provider": video_provider
            };

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push(data);
                postData(data)
            } else {
                console.log(data);
            }
            break;

            // This event is fied when user's click on the pause button
        case 'pause':
            data = {
                "event": "html5_video",
                "video_status": "Pause",
                "video_title": video_title,
                "video_src": video_src,
                "video_percent": live ? Math.floor(e.target.currentTime) + 's' : Math.floor(e.target.currentTime * 100 / e.target.duration) + '%',
                "video_position": Math.floor(e.target.currentTime),
                "video_duration": Math.floor(e.target.duration),
                "video_page_url": window.location.href,
                "video_provider": video_provider
            };

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push(data);
                postData(data)
            } else {
                console.log(data);
            }
            break;

            // If the user ends playing the video, an Finish video will be pushed ( This equals to % played = 100 )  
        case 'ended':
            data = {
                "event": "html5_video",
                "video_status": "Complete",
                "video_title": video_title,
                "video_src": video_src,
                "video_percent": live ? Math.floor(e.target.currentTime) + 's' : Math.floor(e.target.currentTime * 100 / e.target.duration) + '%',
                "video_position": Math.floor(e.target.currentTime),
                "video_duration": Math.floor(e.target.duration),
                "video_page_url": window.location.href,
                "video_provider": video_provider
            };

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push(data);
                postData(data)
            } else {
                console.log(data);
            }
            break;

            // This event type is sent everytime the player updated it's current time, 
            // We're using for the % of the video played. 
        case 'timeupdate':

            // console.log(player.getDuration());

            let percentPlayed = Math.floor(e.target.currentTime * 100 / e.target.duration);

            let drivenumber = 5;
            if (e.target.duration <= 900) {
                drivenumber = 25;
            } else if (e.target.duration <= 1800) {
                drivenumber = 20;
            } else if (e.target.duration <= 3600) {
                drivenumber = 10;
            } else {
                drivenumber = 5;
            }

            if (live) {
                percentPlayed = Math.floor(e.target.currentTime);
                if (percentPlayed % 300 == 0) {
                    if (e.target.dataset.playersmarkers.split(",").includes(percentPlayed.toString() + '_' + video_title) === false) {
                        data = {
                            'event': 'html5_video',
                            'video_status': 'Progress',
                            "video_title": video_title,
                            "video_src": video_src,
                            "video_percent": percentPlayed + 's',
                            "video_position": Math.floor(e.target.currentTime),
                            "video_duration": Math.floor(e.target.duration),
                            "video_page_url": window.location.href,
                            'video_provider': video_provider
                        };

                        if (typeof dataLayer !== 'undefined') {
                            dataLayer.push(data);
                            postData(data)
                        } else {
                            console.log(data);
                        }

                        e.target.setAttribute('data-playersmarkers', e.target.dataset.playersmarkers + ',' + percentPlayed.toString() + '_' + video_title);
                        // console.log(e.target);
                    }
                }
            } else if (percentPlayed % drivenumber == 0) {
                if (e.target.dataset.playersmarkers.split(",").includes(percentPlayed.toString() + '_' + video_title) === false) {
                    data = {
                        'event': 'html5_video',
                        'video_status': 'Progress',
                        "video_title": video_title,
                        "video_src": video_src,
                        "video_percent": percentPlayed + '%',
                        "video_position": Math.floor(e.target.currentTime),
                        "video_duration": Math.floor(e.target.duration),
                        "video_page_url": window.location.href,
                        'video_provider': video_provider
                    };

                    if (typeof dataLayer !== 'undefined') {
                        dataLayer.push(data);
                        postData(data)
                    } else {
                        console.log(data);
                    }

                    e.target.setAttribute('data-playersmarkers', e.target.dataset.playersmarkers + ',' + percentPlayed.toString() + '_' + video_title);
                    // console.log(e.target);
                }
            }
            break;

        default:
            break;
    }
}

export {
    addPlayEvent,
    removePlayEvent,
    eventHandler,
}