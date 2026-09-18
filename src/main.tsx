import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {TeacherTestApp} from './teacher-test/TeacherTestApp';
import {TeacherResultsApp} from './teacher-test/TeacherResultsApp';
import './index.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const RootApp = path === '/teacher-test/results'
  ? TeacherResultsApp
  : path === '/teacher-test'
    ? TeacherTestApp
    : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
