<h1 align="center">Who sent that?</h1>

<p align="center">Discord chat guessing game, where you have to guess who sent the message.</br>Includes a live leaderboard and Discord notifications.</p>

## Demo Site

This is a demo version of the game, the chat logs are randomly generated and not real. There is a cheat button for testing out streaks and bonuses.
You can play the demo version here: [whosentthat.wilzzu.dev](https://whosentthat.wilzzu.dev/).

## Features

- A randomly chosen chat log is shown each round
- Choose from 4 different chatters
- Different rarities for chat logs and chatters
- Message filtering
- Support for attachments and links
- Streaks and bonuses
- Statistics for each run
- Live leaderboard
- Discord notifications
- User authentication
- Responsive design

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Discord.js
- **Database**: MongoDB
- **Authentication**: Supabase

## Important Notices

> [!WARNING]
> Due to a policy change made by Discord in November 2023, attachment URLs now expire after 24 hours and can't be shown in the game.

> [!CAUTION]
> This project was originally created only for our friend group's private Discord server, it shouldn't be used in large public servers. You need to gather and host the chat logs and the database yourself, and make sure that data is stored securely. Both the frontend and backend use multiple points of authentication to ensure any user that gets access to the data is authorized to do so, but you should still take measures to ensure the data is stored securely on your end. Here's a reminder of the GDPR requirements you should follow to use this project in your server:
>
> - Every user in the chat logs should be over the age of 16, see [Article 8 of the GDPR](https://gdpr-info.eu/art-8-gdpr/).
> - You should inform the users that their messages will be stored and used in the game, and you should get their consent to do so, see [Article 6 of the GDPR](https://gdpr-info.eu/art-6-gdpr/).
> - You should inform the users that their data will be stored securely, and you should take measures to ensure that the data is stored securely, see [Article 5 of the GDPR](https://gdpr-info.eu/art-5-gdpr/).
> - Every user in the server should have the right to access, rectify and erase their data, see [Articles 15-20 of the GDPR](https://gdpr-info.eu/chapter-3/).

## Setup and Installation

To run the project locally:

1. **Clone the repository:**

   ```
   git clone https://github.com/Wilzzu/whosentthat.git
   cd WhoSentThat
   ```

2. **Install dependencies:**

   ```
   # For backend
   cd backend
   npm install

   # For frontend
   cd frontend
   npm install
   ```

3. **Configuration:**
   Before starting the development server, ensure that the environment variables and config files are correctly configured. Refer to the [Configuration](#configuration) section for detailed instructions.

4. **Run the application:**

   ```
   # Start the backend server
   cd backend
   npm run start

   # Start the frontend development server
   cd frontend
   npm run dev
   ```

## Configuration

### Environment Variables

Rename the `.env.example` files in both `backend` and `frontend` directories to `.env` and fill in the values:

**Frontend `.env` file:**

| Variable                 | Description                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL`           | The URL where your backend API is hosted, e.g., `http://localhost:3000`.                               |
| `VITE_SUPABASE_USER`     | The username for your Supabase project.                                                                |
| `VITE_SUPABASE_PASS`     | The password for your Supabase project.                                                                |
| `VITE_SUPABASE_URL`      | URL found in `Project Settings` > `API` > `Project URL` in your Supabase project.                      |
| `VITE_SUPABASE_ANON_KEY` | Anon key found in `Project Settings` > `API` > `Project API keys` in your Supabase project.            |
| `VITE_CRYPTOPASS`        | A random string used for encryption. Should be the same in both the frontend and backend `.env` files. |
| `VITE_CRYPTOWORD`        | A random string used for encryption. Should be the same in both the frontend and backend `.env` files. |

**Backend `.env` file:**

| Variable           | Description                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `PORT`             | The port where the backend server will run, e.g., `3000`.                                              |
| `DC_TOKEN`         | Bot token found in `Bot` > `Token` in your Discord Developer Portal application.                       |
| `CHANNEL_ID`       | Discord channel ID where the bot will send high score notifications.                                   |
| `GUILD_ID`         | ID of the Discord server.                                                                              |
| `MONGODB_USERNAME` | MongoDB database username found in `Database Access` section of your project.                          |
| `MONGODB_PASSWORD` | MongoDB database password found in `Database Access` section of your project.                          |
| `WEBSITE_URL`      | The URL where your frontend is hosted, e.g., `https://whosentthat.wilzzu.dev/`.                        |
| `CRYPTOPASS`       | A random string used for encryption. Should be the same in both the frontend and backend `.env` files. |
| `CRYPTOWORD`       | A random string used for encryption. Should be the same in both the frontend and backend `.env` files. |

### Config Files

There are config files for both the frontend and backend. The config files are located in `frontend/src/configs` and `backend/config`, respectively.

**Frontend `config.json` file:**

| Variable                              | Description                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `heroMessagesSafe`                    | Array of messages that are shown to everyone in the login page hero section.                                        |
| `heroMessagesShowOnlyForGroupMembers` | Array of messages that are shown only to group members in the login page hero section.                              |
| `isDemo`                              | Set to `true` to allow everyone to access the game without authentication. Set to `false` to enable authentication. |

**Backend `config.json` file:**

| Variable                                 | Description                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chatters`                               | Arrays of Discord IDs for chatters that appear in choices. The choices are randomly selected from these arrays based on rarity.                                                                                                                                                                                                         |
| `messages.files.<rarity>`                | Arrays of file names in their respective rarities. The game will pick a random files based on their rarity. General files are automatically added, so you don't need to specify them.                                                                                                                                                   |
| `messages.files.oldAmount`               | Number specifying the amount of old general chat log files.                                                                                                                                                                                                                                                                             |
| `messages.files.newAmount`               | Number specifying the amount of new general chat log files.                                                                                                                                                                                                                                                                             |
| `messages.files.divideGeneralMessagesBy` | Number determining how often old general chat log files are selected compared to new ones. For example, setting it to `4` gives a 25% chance `(1 in 4)` for old files and 75% chance for new files to be selected. Set this to `2` `(1 in 2)` for an equal chance of old and new files.                                                 |
| `messages.rarity`                        | Number specifying how often different chat logs are picked. The number is converted to percentage, so if you set general to `50` and rare to `30`, then there's a 50% chance for general, 30% chance for rare and 20% chance for super rare chat log file. Super rare chance is calculated automatically, you don't need to specify it. |
| `isDemo`                                 | Set to `true` by default, which will disable some features, such as user authentication. **If you are going to use this game in your server, make sure this is set to `false` to enable all the important features.**                                                                                                                   |

### Database Files

Chat log files should be structured and have at least the following fields:

```json
{
  "messages": [
    {
      "content": "Message content",
      "author": {
        "id": "123",
        "name": "Name",
        "nickname": "Nickname",
        "isBot": false,
        "avatarUrl": "https://cdn.discordapp.com/embed/avatars/1.png"
      },
      "attachments": [
        {
          "url": "link-to-attachment",
          "filename": "Attachment name"
        }
      ],
      "embeds": []
    }
    ...
  ],
  "messageCount": <Amount of messages in the file>
}
```

## API Endpoints

### Public Endpoints

- `GET /api/scoreboard` - Retrieve the leaderboard.

### Protected Endpoints

These endpoints require authentication.

- `GET /api/authenticate` - Authenticate the user.
- `GET /api/new` - Get a new chat log.
- `POST /api/addScore` - Add a new score to the leaderboard.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
