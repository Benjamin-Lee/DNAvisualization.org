<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="light"
      variant="white"
      class="rounded border-bottom"
    >
      <!-- <b-navbar-brand href="">DNAvisualization.org</b-navbar-brand> -->
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
            href="https://github.com/Benjamin-Lee/DNAvisualization.org/issues/new?assignees=&amp;labels=bug&amp;template=bug_report.md&amp;title="
            target="_blank"
            >Report a Bug</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt></nuxt>
  </div>
</template>
