let apiKey="bb7bcb6cb3ddb7d40f74d0fe311aaa52";
let imageURL="https://image.tmdb.org/t/p/w500";

function showMovies(list){
    let container=document.getElementById("movies");
    container.innerHTML="";
    list.forEach(function(m){
        if(!m.poster_path) return;

        container.innerHTML+=`
        <div class="movie">
            <img src="${imageURL+m.poster_path}">
            <div class="movie-info">
                <h3>${m.title}</h3>
                <p>${m.release_date}</p>
                <p class="rating">⭐ ${m.vote_average}</p>
                <button onclick="openTrailer(${m.id})">Watch Trailer</button>
            </div>
        </div>`;
    });
}

function loadTrending(){
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(data=>{
        showMovies(data.results);
    });
}

loadTrending();

document.getElementById("search").addEventListener("keyup", function(){
    let movie=this.value;
    if(movie.length<2) return;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`)
    .then(res=>res.json())
    .then(data=>showMovies(data.results));
});

document.getElementById("language").addEventListener("change", function(){
    let lang=this.value;
    if(lang===""){
        loadTrending();
        return;
    }
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${lang}`)
    .then(res=>res.json())
    .then(data=>showMovies(data.results));
});

// 🔧 Open trailer in modal
function openTrailer(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(data=>{
        let video = data.results.find(v => v.site==="YouTube");
        let modal = document.getElementById("trailerModal");
        let frame = document.getElementById("trailerFrame");

        if(video){
            frame.src=`https://www.youtube.com/embed/${video.key}?autoplay=1`;
            modal.style.display="flex";
        }else{
            alert("No trailer available for this movie.");
        }
    });
}

// Close modal
function closeModal(){
    let modal = document.getElementById("trailerModal");
    let frame = document.getElementById("trailerFrame");
    frame.src="";
    modal.style.display="none";
}
