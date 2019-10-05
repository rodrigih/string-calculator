# String Calculator

## Overview

This is a web app, created with React, that performs calculations on numbers separated by a delimiter.
The default delimiter is a comma (`,`). The newline character is also treated as a delimiter by default.

## Features

### Upperbounds

An upperbound can be entered so that the calculatoin ignores numbers higher than the upper bound.

### Ignore negative numbers

Negative numbers are ignored by default. The option can be turned on/off via a checkbox.

### Custom delimiters

#### Single character delimiter

The format for enter a single character delimiter is: `//{delimiter}\n{numbers}`

- examples: `//#\n2#5` will return `7`; `//,\n2,ff,100` will return `102`

#### Multiple delimiters

The format for enter multiple delimiter is: `//[{delimiter1}][{delimiter2}]...\n{numbers}`

- example: `//[*][!!][r9r]\n11r9r22*hh*33!!44` will return `110`

If one delimiter with multiple characters is desired the following format can be used: `//[{delimiter}]\n{numbers}`

- example: `//[***]\n11***22***33` will return `66`

** _NOTE:_ If you want to enter any of the special characters below, you must use the escape character to prevent ambiguity **

- `\`
- `[`
- `]`

** This does not apply to the single character delimiter. **

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
