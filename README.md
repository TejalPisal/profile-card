#  Dynamic Profile Card

This is a user profile card is built using **HTML**, **CSS**, and **JavaScript**. It fetches user data from an external API and dynamically displays user profiles. This includes the following features:
- Dynamic loading of user profiles with name, email, bio, and profile pictures.
- Light/Dark mode toggle.
- Profile image upload and deletion.
- Email validation and truncation.
- "Read More" functionality for bio.

## Features

- **Loading Spinner**: A loading spinner appears while fetching user data.
- **Error Handling**: Displays an error message if there is an issue fetching the data.
- **Dark/Light Mode**: Users can toggle between dark and light themes, with their preference saved in `localStorage`.
- **Profile Image Management**: Users can upload new profile pictures or delete them.
- **Email Validation**: Ensures that emails are in valid format, with long emails being truncated for display.
- **Bio Truncation**: Long bios are truncated with a "Read More" button to reveal the full content.

## Technologies Used

- **HTML**
- **CSS**
- **JavaScript**
- **External API** for user data: `[https://mocki.io/v1/b3754cc5-c341-4459-9fa1-baed8f562f21](https://mocki.io/v1/b3754cc5-c341-4459-9fa1-baed8f562f21)`

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TejalPisal/profile-card.git
   cd profile-card
