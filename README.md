# GitHub Profile Finder

A responsive web application that allows users to search for any GitHub username and view profile information using the GitHub REST API.

## Features

- Search GitHub users by username
- Display avatar, name, username, bio, account creation date, location, company, website, and Twitter/X handle
- Show repository, follower, and following counts
- Display six recently updated public repositories
- Show repository language, stars, forks, and last updated date
- Responsive UI for desktop, tablet, and mobile
- Error handling for missing usernames, invalid users, and API failures

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6+
- GitHub REST API

## How to Run

1. Download or clone this folder.
2. Open `index.html` in a web browser.
3. Type a GitHub username and click **Search**.

> Note: The app uses GitHub's public unauthenticated API. If many requests are made from the same IP address, GitHub may temporarily rate-limit requests.

## Project Structure

```text
github-profile-finder/
├── index.html
├── style.css
├── script.js
├── README.md
└── LINKEDIN_PROJECT_DOCUMENT.md
```

## API Endpoints Used

```text
https://api.github.com/users/{username}
https://api.github.com/users/{username}/repos?sort=updated&per_page=6
```
