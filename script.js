// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});

// 導航欄滾動效果
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // 向下滾動
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // 向上滾動
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
});

// 載入推薦數據
async function loadRecommendations() {
    try {
        // 載入電影數據
        const moviesResponse = await fetch('data/movies.json');
        const moviesData = await moviesResponse.json();
        displayMovies(moviesData.movies);

        // 載入音樂數據
        const musicResponse = await fetch('data/music.json');
        const musicData = await musicResponse.json();
        displayMusic(musicData.songs);

        // 載入書籍數據
        const booksResponse = await fetch('data/books.json');
        const booksData = await booksResponse.json();
        displayBooks(booksData.books);
    } catch (error) {
        console.error('載入推薦數據時發生錯誤:', error);
    }
}

// 顯示電影列表
function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = movies.map(movie => `
        <div class="movie-item">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">${movie.year} • ${movie.director}</div>
            </div>
            <div class="movie-rating">${'★'.repeat(movie.rating)}${'☆'.repeat(5-movie.rating)}</div>
        </div>
    `).join('');
}

// 顯示音樂列表
function displayMusic(songs) {
    const musicList = document.getElementById('music-list');
    musicList.innerHTML = songs.map(song => `
        <div class="music-item">
            <div class="music-info">
                <div class="music-title">${song.title}</div>
                <div class="music-details">${song.artist} • ${song.year}</div>
            </div>
            <button class="play-button" onclick="toggleMusic('${song.audioFile}', ${song.previewDuration}, this)">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `).join('');
}

// 顯示書籍列表
function displayBooks(books) {
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = books.map(book => `
        <div class="book-item">
            <div class="book-title">${book.title}</div>
            <div class="book-details">${book.year} • ${book.author} • ${book.country}</div>
        </div>
    `).join('');
}

// 當前播放器引用
let currentAudio = null;
let currentButton = null;
let previewTimeout = null;

// 播放/暫停音樂
function toggleMusic(audioFile, previewDuration, button) {
    const icon = button.querySelector('i');
    const isPlaying = icon.classList.contains('fa-pause');
    
    if (isPlaying) {
        // 暫停播放
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
            currentButton = null;
        }
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }
    } else {
        // 開始播放
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        
        // 如果已經有其他音樂在播放，先停止它
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentButton.querySelector('i').classList.remove('fa-pause');
            currentButton.querySelector('i').classList.add('fa-play');
        }
        
        // 創建新的音頻對象
        const audio = new Audio(audioFile);
        currentAudio = audio;
        currentButton = button;
        
        // 播放音頻
        audio.play();
        
        // 設置預覽時間限制
        previewTimeout = setTimeout(() => {
            if (currentAudio === audio) {
                audio.pause();
                audio.currentTime = 0;
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                currentAudio = null;
                currentButton = null;
            }
        }, previewDuration * 1000);
        
        // 音頻播放結束時的處理
        audio.addEventListener('ended', () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            currentAudio = null;
            currentButton = null;
        });
    }
}

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
}); 