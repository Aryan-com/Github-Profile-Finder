const form = document.querySelector('#searchForm');
const input = document.querySelector('#usernameInput');
const statusBox = document.querySelector('#statusBox');
const profileSection = document.querySelector('#profileSection');
const samples = document.querySelectorAll('.sample');

const apiBase = 'https://api.github.com/users/';

const elements = {
  avatar: document.querySelector('#avatar'),
  displayName: document.querySelector('#displayName'),
  usernameLink: document.querySelector('#usernameLink'),
  bio: document.querySelector('#bio'),
  repoCount: document.querySelector('#repoCount'),
  followersCount: document.querySelector('#followersCount'),
  followingCount: document.querySelector('#followingCount'),
  location: document.querySelector('#location'),
  company: document.querySelector('#company'),
  website: document.querySelector('#website'),
  twitter: document.querySelector('#twitter'),
  joinedDate: document.querySelector('#joinedDate'),
  reposList: document.querySelector('#reposList'),
  reposLink: document.querySelector('#reposLink')
};

function setStatus(message, type = '') {
  statusBox.textContent = message;
  statusBox.className = `status show ${type}`.trim();
}

function clearStatus() {
  statusBox.textContent = '';
  statusBox.className = 'status';
}

function safeText(value, fallback = 'Not available') {
  return value ? value : fallback;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
}

function normalizeUrl(url) {
  if (!url) return '#';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
}

function languageColor(language) {
  const colors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
    HTML: '#e34c26', CSS: '#563d7c', Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584',
    PHP: '#4F5D95', C: '#555555', 'C++': '#f34b7d', Swift: '#F05138', Kotlin: '#A97BFF'
  };
  return colors[language] || '#61dafb';
}

function renderProfile(user) {
  elements.avatar.src = user.avatar_url;
  elements.avatar.alt = `${user.login}'s GitHub avatar`;
  elements.displayName.textContent = user.name || user.login;
  elements.usernameLink.textContent = `@${user.login}`;
  elements.usernameLink.href = user.html_url;
  elements.bio.textContent = safeText(user.bio, 'This user has not added a bio yet.');
  elements.repoCount.textContent = user.public_repos.toLocaleString();
  elements.followersCount.textContent = user.followers.toLocaleString();
  elements.followingCount.textContent = user.following.toLocaleString();
  elements.location.textContent = safeText(user.location);
  elements.company.textContent = safeText(user.company);
  elements.joinedDate.textContent = `Joined ${formatDate(user.created_at)}`;
  elements.reposLink.href = `${user.html_url}?tab=repositories`;

  const blogUrl = normalizeUrl(user.blog);
  elements.website.textContent = user.blog ? user.blog : 'Not available';
  elements.website.href = blogUrl;
  elements.website.style.pointerEvents = user.blog ? 'auto' : 'none';

  const twitterUrl = user.twitter_username ? `https://twitter.com/${user.twitter_username}` : '#';
  elements.twitter.textContent = user.twitter_username ? `@${user.twitter_username}` : 'Not available';
  elements.twitter.href = twitterUrl;
  elements.twitter.style.pointerEvents = user.twitter_username ? 'auto' : 'none';
}

function renderRepos(repos) {
  elements.reposList.innerHTML = '';

  if (!repos.length) {
    elements.reposList.innerHTML = '<p class="empty">No public repositories found.</p>';
    return;
  }

  repos.slice(0, 6).forEach((repo) => {
    const article = document.createElement('article');
    article.className = 'repo';
    article.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
      <p>${repo.description || 'No description provided for this repository.'}</p>
      <div class="repo-meta">
        <span>${repo.language ? `<i class="language-dot" style="background:${languageColor(repo.language)}"></i>${repo.language}` : 'No language'}</span>
        <span>⭐ ${repo.stargazers_count.toLocaleString()}</span>
        <span>🍴 ${repo.forks_count.toLocaleString()}</span>
        <span>Updated ${formatDate(repo.updated_at)}</span>
      </div>
    `;
    elements.reposList.appendChild(article);
  });
}

async function findProfile(username) {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    setStatus('Please enter a GitHub username.', 'error');
    return;
  }

  profileSection.classList.add('hidden');
  setStatus(`Searching GitHub for "${cleanUsername}"...`);

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`${apiBase}${encodeURIComponent(cleanUsername)}`),
      fetch(`${apiBase}${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=6`)
    ]);

    if (userResponse.status === 404) {
      throw new Error('No GitHub profile was found for that username. Please check the spelling and try again.');
    }

    if (!userResponse.ok) {
      throw new Error('GitHub API request failed. You may have reached the unauthenticated API rate limit. Please try again later.');
    }

    const user = await userResponse.json();
    const repos = reposResponse.ok ? await reposResponse.json() : [];

    renderProfile(user);
    renderRepos(repos);
    profileSection.classList.remove('hidden');
    setStatus(`Profile loaded successfully for @${user.login}.`, 'success');
  } catch (error) {
    profileSection.classList.add('hidden');
    setStatus(error.message || 'Something went wrong. Please try again.', 'error');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  findProfile(input.value);
});

samples.forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.dataset.user;
    findProfile(button.dataset.user);
  });
});

window.addEventListener('load', () => {
  clearStatus();
  input.focus();
});
