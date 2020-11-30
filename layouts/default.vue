<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="light"
      variant="white"
      class="rounded border-bottom"
    >
      <b-navbar-brand href="">DNAvisualization.org</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/instructions">Instructions</b-nav-item>
          <b-nav-item to="/architecture">Architecture</b-nav-item>
          <b-nav-item to="#">Citation</b-nav-item>
          <b-nav-item to="#">Contact</b-nav-item>
          <b-nav-item
            href="https://github.com/Benjamin-Lee/DNAvisualization.org/issues/new?assignees=&amp;labels=bug&amp;template=bug_report.md&amp;title="
            target="_blank"
            >Report a Bug</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit"
              >Search</b-button
            >
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt></nuxt>
  </div>
</template>
