<template>
  <div class="d-flex flex-column sticky-footer-wrapper min-vh-100">
    <b-navbar toggleable="lg" variant="light" class="rounded border-bottom">
      <b-navbar-brand to="/">
        <img
          src="/images/logo.svg"
          style="max-height: 40px"
          alt="DNAvisualization.org logo"
        />
      </b-navbar-brand>
      <b-navbar-brand to="/">
        <img
          src="/images/words.svg"
          style="max-height: 20px"
          class="d-lg-inline d-none"
          alt="DNAvisualization.org wordmark"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/instructions">Instructions</b-nav-item>
          <b-nav-item to="#">Contact</b-nav-item>
          <b-nav-item
            href="https://github.com/Benjamin-Lee/DNAvisualization.org"
            target="_blank"
          >
            GitHub
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt class="flex-fill"></nuxt>
    <footer class="bg-light py-3 border-top">
      <b-container class="text-center">
        <span
          >©{{ new Date().getFullYear() }} IQT Labs LLC, a wholly owned research
          venture of In-Q-Tel, Inc. This content is released under the Apache
          2.0 License, except for the DNA and chart icons, which are licensed
          under CC BY-ND 3.0 by Icons8.</span
        >
      </b-container>
    </footer>
  </div>
</template>
<style>
.navbar-light .navbar-nav .nav-link {
  color: #495057;
}
</style>
