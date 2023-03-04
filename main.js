//TMDB

const API_KEY = 'api_key=89f22a656bc8f903bf1046a008c477db';
const BASE_URL ='https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = {
    "genres": [
    {
    "id": 28,
    "name": "Action"
    },
    {
    "id": 12,
    "name": "Adventure"
    },
    {
    "id": 16,
    "name": "Animation"
    },
    {
    "id": 35,
    "name": "Comedy"
    },
    {
    "id": 80,
    "name": "Crime"
    },
    {
    "id": 99,
    "name": "Documentary"
    },
    {
    "id": 18,
    "name": "Drama"
    },
    {
    "id": 10751,
    "name": "Family"
    },
    {
    "id": 14,
    "name": "Fantasy"
    },
    {
    "id": 36,
    "name": "History"
    },
    {
    "id": 27,
    "name": "Horror"
    },
    {
    "id": 10402,
    "name": "Music"
    },
    {
    "id": 9648,
    "name": "Mystery"
    },
    {
    "id": 10749,
    "name": "Romance"
    },
    {
    "id": 878,
    "name": "Science Fiction"
    },
    {
    "id": 10770,
    "name": "TV Movie"
    },
    {
    "id": 53,
    "name": "Thriller"
    },
    {
    "id": 10752,
    "name": "War"
    },
    {
    "id": 37,
    "name": "Western"
    }
    ]
    }

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const paginationContainer = document.getElementById('pagination');

let current_page = 1;
let rows = 5;

var selectedGenre = [];

setGenre();

function setGenre(){
   
    tagsEl.innerHTML = '';
    genres.genres.forEach(genre =>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () =>{
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    });
                }else{
                    selectedGenre.push(genre.id);
                 
                }
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagsEl.append(t);
    });
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>{
        tag.classList.remove('highlight');
    })
    clearButton();
    if(selectedGenre.length !== 0){
        selectedGenre.forEach(id =>{
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        });
    }
    
}

function clearButton(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () =>{
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        });
        tagsEl.append(clear);
    }
 
}

getMovies(API_URL);

function getMovies(url){
    fetch(url)
    .then(res => res.json())
    .then(data =>{
        if(data.results.length !== 0){
            createPagination(data.results);
        }else{
            console.log(data);
            main.innerHTML = `<h1 class = 'no-results'>No Results Found</h1>`;
            paginationContainer.innerHTML = '';
        }
    })
    .catch(err =>{
        console.log(err);
    });
}


function showMovies(data,main,rows, current_page){
    main.innerHTML = '';
 
    current_page--;
    let start = rows * current_page;
    let end = start + rows;
    const paginatedItems = data.slice(start,end);

    paginatedItems.forEach(movie => {
        console.log(data);
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img
        src="${poster_path? IMG_URL+poster_path :'http://via.placeholder.com/1080x1580' }"
        alt="${title}"
      />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
        `
        main.appendChild(movieEl);
    });
    
}

function getColor(vote){
    if(vote >= 8){
        return 'green';
    }else if(vote >= 5){
        return 'orange';
    }else{
        return 'red';
    }
}

form.addEventListener('submit', e =>{
    e.preventDefault();

   const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
   if(searchTerm){
       getMovies(searchURL + '&query=' + searchTerm);
   }else{
    getMovies(API_URL);
   }

})


/*------------------------- pagination -------------------------*/
function createPagination(data){
    paginationContainer.innerHTML = '';
    const dataLength = data.length
    let numberOfBtn = Math.ceil(dataLength / rows);
    numberOfBtn = numberOfBtn + 2;
    paginationBtn(numberOfBtn,data);
    showMovies(data,main,rows, current_page);
}

function paginationBtn(numberOfBtn,data){
    numberOfBtn--;
 

    //creating pagination button
    for(let i = 0; i <= numberOfBtn; i++){
        const buttonEl = document.createElement('button');
        if(i === 0){
            buttonEl.innerText = '<';
            buttonEl.classList.add('previous-button');
            buttonEl.classList.add('disabled');
        }else if(i === numberOfBtn){
            buttonEl.innerText = '>';
            buttonEl.classList.add('next-button');
        }else if(i === 1){
            buttonEl.innerText = 1;
            buttonEl.classList.add('active');
        }else{
            buttonEl.innerText = i;
        }
        paginationContainer.appendChild(buttonEl)
        var nextBtn = document.querySelector('.next-button'); 
        var previousBtn = document.querySelector('.previous-button'); 
        //listen for click event of button
        buttonEl.addEventListener('click', e =>{
            let currentActiveButton = document.querySelector('.pageNumbers button.active');
            currentActiveButton.classList.remove('active');
            const clickedBtn = e.target.innerText * 1;
 
            //put active class in button
            if(e.target.className.includes('next-button')){
                currentActiveButton.nextElementSibling.classList.add('active');
                currentActiveButton = currentActiveButton.nextElementSibling;
                current_page++;
            }else if(e.target.className.includes('previous-button')){
                currentActiveButton.previousElementSibling.classList.add('active');
                currentActiveButton = currentActiveButton.previousElementSibling;
                current_page--;
            }else{
                buttonEl.classList.add('active');
                currentActiveButton =  buttonEl;
                current_page = clickedBtn;
            }

            //toggle disabled class in button
            if(numberOfBtn == 2){
                previousBtn.classList.add('disabled');
                nextBtn.classList.add('disabled');
                return
            }

            if(current_page === 1){
                currentActiveButton.previousElementSibling.classList.add('disabled');
                nextBtn.classList.remove('disabled');
            }else if(current_page === (numberOfBtn -1)){
                currentActiveButton.nextElementSibling.classList.add('disabled');
                previousBtn.classList.remove('disabled');
            }else{
                previousBtn.classList.remove('disabled');
                nextBtn.classList.remove('disabled');
            }
            showMovies(data,main,rows, current_page);
        });
    }
   
    if(numberOfBtn == 2){
        previousBtn.classList.add('disabled');
        nextBtn.classList.add('disabled');
    }
}
