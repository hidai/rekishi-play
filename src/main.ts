import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

// The inlined bundle is a module script, so it is deferred: the DOM (including
// #app) is fully parsed by the time this runs. Mount directly.
mount(App, { target: document.getElementById('app')! });
