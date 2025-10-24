# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Fertilizer label reader (OCR + Gemini)

This project includes a small example that lets you upload an image of a fertilizer bottle label, extracts text from it in the browser using `tesseract.js`, then forwards that text to a local server which calls the Google Generative (Gemini) API and returns a description.

Setup summary:

1. Copy `.env.example` to `.env` and put your `GOOGLE_API_KEY` there.
2. npm install
3. Run the server: `npm run start:server` (listens on port 5000 by default)
4. Start the React app: `npm start`

Open the app, go to the pesticide/fertilizer component, upload the bottle image, click "Read label and Describe" and you'll see extracted text and the generated description.

Port conflicts

If you already have another backend running on port 5000 (for example a Python service), you have two options:

- Stop the other process (Windows example using PID obtained via `netstat -ano`):

```cmd
taskkill /PID <pid> /F
```

- Or run the proxy server on a different port. An alternate npm script is provided:

```cmd
npm run start:server:alt
```

If you run the alternate server on port 5001 you should also update the `proxy` field in `package.json` to `http://127.0.0.1:5001` so React forwards API calls to the correct port.

Direct client calls to Gemini (security warning)

You asked to remove the local proxy and call the Gemini API directly from the browser. I removed `server.js` from the project and updated the `Pesticide` component to send requests directly to the Gemini endpoint using an API key you enter in the UI.

Important security notes:

- Calling Gemini directly from the browser exposes your API key to end-users and to anyone who inspects network requests. Do not use this in production.
- Prefer server-side proxies or proper OAuth/service-account flows for production workloads. If you need help re-adding a secure proxy using service accounts, I can implement that.
"# crop" 
