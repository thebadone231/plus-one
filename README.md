<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/thebadone231/plus-one">
    <img src="assets/+1 logo.png" alt="Logo" width="120" height="120">
  </a>

<h3 align="center">+1</h3>

  <p align="center">
    I am getting Liho later, who want? +1!
    <br />
    <a href="https://plus-one-orbital.herokuapp.com/">View Demo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#challenges">Challenges</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<br />
<div id="#about-the-project"></div>

## About The Project

<br />
<div align="center">
<img src="assets/Orbital Poster.jpg" alt="Orbital Poster" width="900" height="1500">

<p align="right">(<a href="#top">back to top</a>)</p>

<br />
</div>
<div id="#built-with"></div>

### Built With

- [ReactNative.js](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="#getting-started"></div>

## Getting Started

To get a local copy up and running follow these simple example steps.

<div id="#installation"></div>

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/thebadone231/plus-one
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the repo
   ```sh
   npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>
<div id="#usage"></div>

## Usage

### Login page

<div align="center">
<img src="assets/Login page 1.jpg" alt="Login page 1" width="300" height="500">
<img src="assets/Login page 2.jpg" alt="Login page 2" width="300" height="500">
<img src="assets/Login page 3.jpg" alt="Login page 3" width="300" height="500">
<img src="assets/Login page 4.jpg" alt="Login page 4" width="300" height="500">
</div>
<br />

### Signup page

<div align="center">
<img src="assets/Signup page 1.jpg" alt="Signup page 1" width="300" height="500">
<img src="assets/Signup page 2.jpg" alt="Signup page 2" width="300" height="500">
<img src="assets/Signup page 3.jpg" alt="Signup page 3" width="300" height="500">
<img src="assets/Signup page 4.jpg" alt="Signup page 4" width="300" height="500">
</div>
<br />

### Forget password page

<div align="center">
<img src="assets/Forgot password page 1.jpg" alt="Forgot password page 1" width="300" height="500">
<img src="assets/Forgot password page 2.jpg" alt="Forgot password page 2" width="300" height="500">
</div>
<br />

### Holding page to be replaced by main interface

<div align="center">
<img src="assets/Holding page 1.jpg" alt="Holding page 1" width="300" height="500">
<img src="assets/Holding page 2.jpg" alt="Holding page 2" width="300" height="500">
</div>

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="#roadmap"></div>

## Roadmap

### 1. Navigation across different screens

Users are able to navigate to different screens by clicking on the corresponding icons or words. This is made possible using the onPress function that calls the backend routing functions when users interact with these pressables.

### 2. Secure Authentication Interface

Before users are allowed access to the services in the application, they will be required to authenticate their identity by keying in the email and password they registered with the application. This information submitted by the user will be cross referenced with that stored in the Firebase authentication server. Once Firebase has ascertained that the veracity of the password provided, users will be directed to the main interface of the application.

### 3. Writing data to Firebase database

New users will be required to register themselves via the “New User” screen in the application. After all necessary fields have been filled up correctly, this information will be written in the Firebase database. This information will be retrieved and rendered in the main interface each time the user logs in to the application.

<div id="#challenges"></div>
<br />

## Challenges

### 1. Reading information retrieved from the database

While information within each query could be processed using basic knowledge on data structures, custom methods created for Firebase provided a more efficient alternative that was also much easier to understand. Hence, a substantial amount of time was spent on experimenting with different methods to investigate how to best process this information so that it can utilised for algorithms we intend to implement in future.

### 2. Structuring the database

Deciding what information is necessary, including those required for features yet to be implemented, was the first issue we had to tackle. We recognise that how the data is structured will impact how we read and process the information in future. Hence, a significant amount of time was dedicated towards determining how to structure this information in the most logical and efficient manner. In addition, we also had to devise workarounds in response to the restrictions imposed by how Firebase databases are organised.

### 3. Rendering alert component

Alerts are incorporated as part of the UI design as they can serve as important visual cues to guide users around the application. While these alerts could be rendered in expo, they could not be rendered when deployed in heroku. We are in the process of resolving this issue. Please refer to the screenshots above on the alerts that are already implemented in the application. 

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="#acknowledgements"></div>

<br />

## Acknowledgments

- [README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#top">back to top</a>)</p>
