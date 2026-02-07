// short list of "Night Sky" themed adjectives and nouns 
// randomly combined to create anonymous usernames
const adjectives = ["Stellar", "Lunar", "Silent", "Nebula", "Drifting", "Vivid", "Cosmic", "Golden", "Midnight"];
const nouns = ["Dreamer", "Voyager", "Echo", "Fragment", "Wanderer", "Starlight", "Shadow", "Seeker", "Muse"];

// Generates a unique name like with format: adjective + noun + _randomNumber
function generateAnonymousName() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${adj}${noun}_${num}`;
}

// Connects the frontend to SupaBase project using Url and Key

const supabaseUrl = 'https://rzwilgwnhuldfhiulogu.supabase.co';
const supabaseKey = 'sb_publishable_8h6GtX7nAWwB7LgP6JlByQ_iDUj4Hca';
const db = supabase.createClient(supabaseUrl, supabaseKey);

let allProjects = [];      // Stores the main list of dreams
let currentTab = 'all';    // Tracks category filter
let viewMode = 'explore';  // Switches between 'explore' and 'profile' views
let isSignUpMode = false;  // if user signed in or not

// Runs immediately when the site opens to prep the website
// get initial data, apply theme, check auth status, and create stars.

window.onload = async () => {
    await fetchDreams();        
    loadTheme();                
    checkUser();                  
    createStarryBackground();     
};

// Shows the login screen and processing SupaBase Auth

function openAuthModal() { document.getElementById('auth-overlay').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('auth-overlay').style.display = 'none'; }

// Swaps between log-in and sign-up
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.getElementById('auth-switch');

    if (isSignUpMode) {
        title.innerText = "Join the Vault";
        subtitle.innerText = "New dreamer? Begin your journey here.";
        submitBtn.innerText = "Sign Up";
        switchText.innerText = "Already shared a dream?";
        switchLink.innerText = "Returning Dreamer";
    } else {
        title.innerText = "Welcome Back";
        subtitle.innerText = "Returning dreamer? Step inside.";
        submitBtn.innerText = "Login";
        switchText.innerText = "New to the vault?";
        switchLink.innerText = "Create an Account";
    }
}

// Processes the actual Auth form submission
document.getElementById('auth-form').onsubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (isSignUpMode) {
        const { error } = await db.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert("Signup successful! You can now login.");
    } else {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else {
            closeAuthModal();
            checkUser();
        }
    }
};

// manages the anonymous identity
async function checkUser() {
    const { data: { user } } = await db.auth.getUser();
    const authBtn = document.getElementById('auth-nav-btn');
    const mainSubtitle = document.querySelector('.subtitle');
    
    if (user) {
        authBtn.innerText = "Sign Out";
        // Get/create an anonymous username for specific User ID
        let anonName = localStorage.getItem(`anon_name_${user.id}`);
        if (!anonName) {
            anonName = generateAnonymousName();
            localStorage.setItem(`anon_name_${user.id}`, anonName);
        }
        mainSubtitle.innerHTML = `Welcome back, <strong>${anonName}</strong>. Your starlight fragments are safe.`;
        authBtn.onclick = async () => {
            await db.auth.signOut();
            location.reload(); // Refresh to clear state
        };
    } else {
        authBtn.innerText = "Sign In";
        authBtn.onclick = openAuthModal;
        mainSubtitle.innerText = "Collecting the fragments of your imagination under the starlight.";
    }
}

// Pulls the "Projects" table from SupaBase
// displays newest projects first in either tab

async function fetchDreams() {
    const { data, error } = await db.from('Projects').select('*').order('created_at', { ascending: false });
    if (error) console.error("Error fetching:", error);
    else {
        allProjects = data;
        renderGrid();
    }
}

// Converts the data arrays 
function renderGrid(dataToDisplay = allProjects) {
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Clear existing content
    
    // Apply filters based on categories and view mode
    let filtered = (viewMode === 'explore' && currentTab !== 'all') 
        ? dataToDisplay.filter(w => w.category.toLowerCase() === currentTab.toLowerCase())
        : dataToDisplay;

    filtered.forEach(work => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';

        // Check if audio then have a visual effect when played, or else show image
        let mediaHTML = work.is_audio 
            ? `<div class="audio-wrapper" onclick="toggleAudio(this)">
                 <div class="wave-container">
                     <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
                 </div>
                 <audio controls class="styled-player" 
                        onplay="this.parentElement.classList.add('playing')" 
                        onpause="this.parentElement.classList.remove('playing')">
                     <source src="${work.media_url}" type="audio/mpeg">
                 </audio>
               </div>`
               // random image if media url is empty
            : `<img src="${work.media_url || 'https://picsum.photos/400'}" alt="art">`;

        // Clean up email to prevent it from being a userName
        const displayAuthor = work.author.includes('@') ? work.author.split('@')[0] : work.author;

        card.innerHTML = `
            <button class="bookmark-btn" onclick="toggleBookmark(${work.id}, this)">☆</button>
            ${mediaHTML}
            <div class="card-content">
                <h3>${work.title}</h3>
                <p class="author" onclick="openUserProfile('${work.author}')" style="cursor:pointer; color:var(--pastel-pink)">
                   by ${displayAuthor}
                </p>
                <p>${work.summary}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Create separate profile pages for fragments from same person
async function openUserProfile(authorName) {
    viewMode = 'profile';
    const grid = document.getElementById('main-grid');
    const header = document.querySelector('header');
    const { data: { user } } = await db.auth.getUser();
    const myAnonName = user ? localStorage.getItem(`anon_name_${user.id}`) : null;

    if(header) header.style.display = 'none'; // Hide the siteWide header
    
    // only shows users projects
    const userPosts = allProjects.filter(p => p.author === authorName);
    
    grid.innerHTML = '';
    
    const profileHeader = document.createElement('div');
    profileHeader.className = 'profile-view-header';
    
    profileHeader.innerHTML = `
        <div class="back-btn-container">
            <span class="back-btn" onclick="location.reload()" style="cursor:pointer; color:var(--pastel-blue);">← Back to Feed</span>
        </div>
        <h1 class="profile-name">${authorName}</h1>
        <p style="opacity:0.6; font-size: 1.1rem; margin-bottom: 15px;">
            ${authorName === myAnonName ? 'This is your vault' : 'Exploring their fragments'}
        </p>
        ${authorName === myAnonName ? 
            `<button onclick="document.getElementById('modal-overlay').style.display = 'flex'" class="add-btn" style="width: auto; padding: 12px 40px; border-radius: 25px;">+ Create New Fragment</button>` 
            : ''}
    `;
    
    grid.appendChild(profileHeader);

    // create the layout of projects
    const postsContainer = document.createElement('div');
    postsContainer.className = 'pinterest-grid';
    postsContainer.id = 'profile-posts-grid';
    postsContainer.style.width = '100%';
    grid.appendChild(postsContainer);

    renderGridInto(userPosts, 'profile-posts-grid');
}

// separate feed into tabs and sections
function renderGridInto(data, containerId) {
    const grid = document.getElementById(containerId);
    
    data.forEach(work => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';

        let mediaHTML = work.is_audio 
            ? `<div class="audio-wrapper" onclick="toggleAudio(this)">
                 <div class="wave-container">
                     <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
                 </div>
                 <audio controls class="styled-player">
                     <source src="${work.media_url}" type="audio/mpeg">
                 </audio>
               </div>`
            : `<img src="${work.media_url || 'https://picsum.photos/400'}" alt="art">`;

        card.innerHTML = `
            <button class="bookmark-btn" onclick="toggleBookmark(${work.id}, this)">☆</button>
            ${mediaHTML}
            <div class="card-content">
                <h3>${work.title}</h3>
                <p>${work.summary}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// navigate to user's profile when logged in
async function showMyOwnProfile() {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return openAuthModal();
    const myName = localStorage.getItem(`anon_name_${user.id}`);
    openUserProfile(myName);
}

// saves projects bookmarked in supaBase

async function toggleBookmark(projectId, btnElement) {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return alert("Sign in to save dreams!");
    
    // Check if bookmark already exists
    const { data: existing } = await db.from('bookmarks').select('*').eq('user_id', user.id).eq('project_id', projectId);
    
    if (existing && existing.length > 0) {
        // If it exists, delete it
        await db.from('bookmarks').delete().eq('user_id', user.id).eq('project_id', projectId);
        btnElement.innerText = "☆";
        btnElement.classList.remove('saved');
    } else {
        // If it doesn't, add it
        await db.from('bookmarks').insert([{ user_id: user.id, project_id: projectId }]);
        btnElement.innerText = "★";
        btnElement.classList.add('saved');
    }
}

// Manages interactions like tabs, search, and themes
// the category navigation bar: for you, ideas, voices, and stories
function setTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(tab) || (tab === 'all' && btn.innerText === 'For You'));
    });
    renderGrid();
}

// the "Add New Fragment" form submission
document.getElementById('idea-form').onsubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return openAuthModal();

    const cat = document.getElementById('category').value;
    const anonName = localStorage.getItem(`anon_name_${user.id}`) || "Anonymous_Dreamer";
    
    const newEntry = {
        title: document.getElementById('title').value,
        author: anonName,
        author_id: user.id,
        summary: document.getElementById('desc').value,
        category: cat,
        media_url: document.getElementById('img-url').value || 'https://picsum.photos/400',
        is_audio: (cat === 'voices') 
    };

    const { error } = await db.from('Projects').insert([newEntry]);
    if (error) alert("Error: " + error.message);
    else {
        document.getElementById('idea-form').reset();
        closeModal();
        await fetchDreams(); // Refresh feed with new post
    }
};

// Simple keyword filtering for the search bar
function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filtered = allProjects.filter(w => w.title.toLowerCase().includes(query) || w.summary.toLowerCase().includes(query));
    renderGrid(filtered);
}

// Day/Night theme toggle button
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('vinshare_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function loadTheme() {
    if (localStorage.getItem('vinshare_theme') === 'light') document.body.classList.add('light-mode');
}

// generates 100 stars for the background of different sizes which blink
function createStarryBackground() {
    const starLayer = document.createElement('div');
    starLayer.className = 'stars-layer';
    document.body.appendChild(starLayer);
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('span');
        star.className = 'star ' + ['tiny', 'small', 'medium'][Math.floor(Math.random() * 3)];
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.innerHTML = '★';
        starLayer.appendChild(star);
    }
}

// Stops the audio animation if audio is manually paused
function toggleAudio(wrapper) {
    if (wrapper.classList.contains('playing')) wrapper.querySelector('audio').pause();
}

// the Escape key to close any open modals
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal(); 
        closeAuthModal(); 
    }
});

// hides the fragment creation modal
function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
}