var videoCardContainer = document.querySelector('.video-container')

var api_key = 'AIzaSyDOkH64Fm7L-08B7K7h_3DqXe6wAfaEbMA';
var video_http = 'https://www.googleapis.com/youtube/v3/videos?';
var channel_http = 'https://www.googleapis.com/youtube/v3/channels?';

fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 50,
    regioncode: 'IN'
}))
    .then(res => res.json())
    .then(data => {
        console.log(data);
        data.items.forEach(item => {
            getChannelIcon(item);
            // subscription(item);
        });
    })
    .catch(err => console.log(err));

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(video_data);
        })
}

const makeVideoCard = (data) => {
    // console.log(data.snippet.channelTitle);
    console.log(data);
    videoCardContainer.innerHTML += `
        <div class="video" onclick="location.href='https://www.youtube.com/watch?v=${data.id}'">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
            <div class="content">
                <img src="${data.channelThumbnail}" class="channel-icon" alt="">
                <div class="info">
                    <h4 class="title">${data.snippet.title}</h4>
                    <p class="channel-name">${data.snippet.channelTitle}</p>
                </div>
            </div>
        </div>`;
}


// Create functionality for topic-based searching and search for playlists or channels

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');

let searchLink = 'https://www.youtube.com/results?search_query=';

searchBtn.addEventListener('click', () => {
    if (searchInput.value.length) {
        location.href = searchLink + searchInput.value;
    }
})

// Create functionality to Retrieve channel information

function getChannelInfo() {
    const channelId = document.getElementById('channelId').value;
    if (!channelId) {
        alert('Please enter a valid YouTube Channel ID.');
        return;
    }

    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        regioncode: 'IN'
    }))
        .then(response => response.json())
        .then(data => {
            if (data.items.length === 0) {
                alert('Channel not found or API key is incorrect.');
            } else {
                displayChannelInfo(data.items[0].snippet);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayChannelInfo(snippet) {
    const channelInfoDiv = document.getElementById('channelInfo');
    channelInfoDiv.innerHTML = `
            <h2>Channel Information:</h2>
            <p><strong>Title:</strong> ${snippet.title}</p>
            <p><strong>Description:</strong> ${snippet.description}</p>
            <p><strong>Published At:</strong> ${snippet.publishedAt}</p>
            <p><strong>Channel Thumbnail:</strong></p>
            <img src="${snippet.thumbnails.default.url}" alt="Channel Thumbnail">
        `;
}