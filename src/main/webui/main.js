// Theme first: it sets the color tokens before anything renders
import './src/services/theme/theme.js';
// Then keep it in sync with the logged-in user's settings
import './src/services/theme/themeSync.js';
import './style.css'
import '@material-icons/font/css/all.css';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// components
import './src/components/icon/icon.js';
import './src/components/button/button-component.js';
import './src/components/header/header-component.js';
import './src/components/sidebar/SideBarComponent.js';
import './src/components/drawer/drawerComponent.js';
import './src/components/router/app-router.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// pages
import './src/pages/home/home-page.js';
import './src/pages/map/map-page.js';
import './src/pages/guide/guide-page.js';
import './src/pages/not-found/not-found-page.js';
import './src/pages/login/login-page.js';




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Init App
console.log('App is running');




