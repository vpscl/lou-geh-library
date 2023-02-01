<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;


  ::-webkit-scrollbar {
    width: 0.45rem;
    height: 0.45rem;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(190, 190, 190);
    border-radius: 20px;

  }

  ::-webkit-scrollbar-thumb {
    &:active {
      background: rgb(173, 173, 173);

    }
  }

  &::before,
  &::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}



html,
body,
#app,
.wrapper {
  // background: #F5F5F9;
  background: #f3f5fa;
  height: 100%;
}



a,
.router-link {
  text-decoration: none;
  color: black;

  &:hover {
    color: black !important;
  }
}

main {
  margin-left: 90px;
  padding: 20px;
}

.wrapper {
  overflow-x: hidden;
}



@media (min-width: 1024px) {
  main {
    padding: 20px 8%;
  }

}
</style>
