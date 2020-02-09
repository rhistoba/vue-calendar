<template>
  <div id="app" class="font-sans max-w-6xl mx-auto px-4">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
