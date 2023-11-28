# NGsoft Home Assignment

Web project allowing users to upload resume PDF files, which are then parsed and analyzed. The platform provides an accessible list of all applicants, offering features to view, delete, and download CVs for efficient hiring workflows.

## Getting Started

### Prerequisites

- Node.js (v14.x or above)
- MongoDB (v4.x or above)
- React.js

### Installation

1. Clone the repository:

    ```shell
    git clone https://github.com/Dor-Azriel/NGsoft--HA
    cd your-repo
    ```

2. Install dependencies:

    ```shell
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    REACT_APP_API_URL=http://127.0.0.1:8000
    MONGODB_URI=mongodb://127.0.0.1:27017/applicantsDB
    ```

## Running the Application

1. Start the Node.js server:

    ```shell
    npm run server
    ```

2. In a new terminal, start the React development server:

    ```shell
    npm start
    ```

3. Open your web browser and visit `http://localhost:3000` to access the application.

## Testing

Provide instructions for running tests here.

## Deployment

Include instructions for deploying the project to a production environment, if applicable.

## Built With

- React - JavaScript framework for building user interfaces
- Node.js - JavaScript runtime environment
- MongoDB - NoSQL database

## License

This project is licensed under the [Your License] - see the [LICENSE.md](LICENSE.md) file for details.
