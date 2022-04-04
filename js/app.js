//HTML element
let elBox = document.querySelector("#box");
let elMovieModal = document.querySelector(".movie-modal");
let elBookmarkList = document.querySelector("#bookmark_list");
let elMoviesForm = document.querySelector("#movies-form");
let elInput = document.querySelector("#search-input");
let elRating = document.querySelector("#rating");
let elFormSelect = document.querySelector("#form-select");
let elFormSort = document.querySelector("#form-sort");
let elMovieAlert = document.querySelector(".movie-alert");
let elBtn = document.querySelector("#form-btn");
let elTemplate = document.querySelector("#template").content;
let elBookmark = document.querySelector("#bookmarked").content;


//Get movies list
let sliceMovies = movies.slice(0, 50);

//Normolize list
var newArrayNormolizeList = sliceMovies.map( (item, index, ) => {
    
    return{
        id: ++index,
        title: item.Title.toString(),
        movie_categories: item.Categories,
        movie_summary: item.summary,
        movie_year: item.movie_year,
        movie_rating: item.imdb_rating,
        movie_img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
        movie_youtubeLink: `https://www.youtube.com/watch?v=${item.ytid}`
        
    }
})

//Generate categories
function renderCategories(array) {
    let movieCategories = []
    
    array.forEach( item => {
        let newCategories = item.movie_categories.split("|");
        
        newCategories.forEach( item => movieCategories.includes(item) ? undefined: movieCategories.push(item))
        
    })
    
    movieCategories.sort()
    
    let optionFragment = document.createDocumentFragment()
    
    movieCategories.forEach((item) => {
        
        let newOption = document.createElement("option");
        
        newOption.value = item
        newOption.textContent = item
        
        optionFragment.appendChild(newOption)
    })
    
    elFormSelect.appendChild(optionFragment)
}

renderCategories(newArrayNormolizeList);

// RenderMovies
function renderMovies(array, box) {
    
    
    box.innerHTML = null;
    
    let elFragment = document.createDocumentFragment();
    
    array.forEach( item => {
        
        let templateDiv = elTemplate.cloneNode(true)
        
        templateDiv.querySelector(".card-img-top").src = item.movie_img,
        templateDiv.querySelector(".card-title").textContent = item.title,
        templateDiv.querySelector(".card-categories").textContent = item.movie_categories.split("|").join(", "),
        templateDiv.querySelector(".card-year").textContent = item.movie_year,
        templateDiv.querySelector(".card-rate").textContent = item.movie_rating,
        templateDiv.querySelector(".card-link").href = item.movie_youtubeLink,
        templateDiv.querySelector(".modal-btn").dataset.movieModal = item.id
        templateDiv.querySelector(".bookmark-btn").dataset.moviesId = item.id
        
        
        elFragment.appendChild(templateDiv);
    });
    
    box.appendChild(elFragment);
    
    let lenghtAlert = array.length;
    
    if (lenghtAlert === 0) {
        elMovieAlert.textContent = "Not Found!";
        elMovieAlert.classList.add("alert-danger");
    }else{
        elMovieAlert.textContent = `Serach result: ${lenghtAlert}`;
        elMovieAlert.classList.remove("alert-danger");
    }
    
    
}

renderMovies(newArrayNormolizeList, elBox)


//Find Movies
let findMovies = function (titleMovie, minRating, genre) {
    
    let filterMovies = newArrayNormolizeList.filter( item => {
        
        var filterCategories = genre === 'All' || item.movie_categories.includes(genre);
        
        return item.title.match(titleMovie) && item.movie_rating >= minRating && filterCategories
    })
    
    return filterMovies
    
}


elMoviesForm.addEventListener("input", (event) => {
    event.preventDefault()
    
    let searchInput = elInput.value.trim()
    let ratingInput = elRating.value.trim()
    let selectOption = elFormSelect.value
    let sortType = elFormSort.value
    
    let pattern = new RegExp(searchInput, "gi")
    let newArray = findMovies(pattern, ratingInput, selectOption);
    
    if (sortType === "high") {
        
        newArray.sort((b, a) => a.movie_rating - b.movie_rating )
    }
    
    if (sortType === "low") {
        
        newArray.sort((a, b) => a.movie_rating - b.movie_rating)
    }
    
    
    renderMovies(newArray, elBox);
})


let stroge = window.localStorage;

let getLocal = JSON.parse(stroge.getItem("newArray"))

let newArrayBookmark 

if (getLocal) {
    newArrayBookmark = getLocal
} else {
    newArrayBookmark = []
}

// 
elBox.addEventListener("click", function (event) {
    
    let getting = event.target.dataset.moviesId;
    
    if (getting) {
        
        let findMovie = newArrayNormolizeList.find( item =>  item.id == getting);
        
        let bookmarkCheck = newArrayBookmark.findIndex( item => item.id === findMovie.id);
        
        if (bookmarkCheck === -1) {
            
            newArrayBookmark.push(findMovie);
            stroge.setItem("newArray", JSON.stringify(newArrayBookmark));
            
            renderBookmark(newArrayBookmark, elBookmarkList);
        }
    }
})


// 
function renderBookmark(array, box) {
    box.innerHTML = null;
    let elFragment = document.createDocumentFragment();
    
    array.forEach(function (item) {
        
        let templateBookmark = elBookmark.cloneNode(true);
        
        templateBookmark.querySelector(".movie-images").src = item.movie_img;
        templateBookmark.querySelector(".movie-heading").textContent = item.title;
        templateBookmark.querySelector(".btn-remove").dataset.btnId = item.id;
        templateBookmark.querySelector(".btn-remove").dataset.MovieId = item.movie_youtubeLink;
        
        elFragment.appendChild(templateBookmark);
    })
    
    box.appendChild(elFragment)
    
}

renderBookmark(newArrayBookmark, elBookmarkList);


// 
elBookmarkList.addEventListener("click", function (event) {
    
    let removeBookmark = event.target.dataset.btnId;
    
    if (removeBookmark) {
        let indexMovie = newArrayBookmark.findIndex(function (item) {
            return item.id == removeBookmark
        })
        
        newArrayBookmark.splice(indexMovie, 1)
        stroge.setItem("newArray", JSON.stringify(newArrayBookmark));
        renderBookmark(newArrayBookmark, elBookmarkList);
    }
    
    // console.log(removeBookmark);
})


// 
elBox.addEventListener("click", function (event) {
    let modalBtn = event.target.dataset.movieModal
    
    if (modalBtn) {
        let findMovie = newArrayNormolizeList.find( item =>  item.id == modalBtn);
        
        elMovieModal.querySelector(".movie-heading").textContent = findMovie.title;
        elMovieModal.querySelector(".movie-text-modal").textContent = findMovie.movie_summary;
        
    }
})