<template>
  <main>
    <div id="pre-rendered">
      Red text on wheat background on mobile.
      <br>
      Light blue text on dark purple background on viewport with width > 1000px.
      <br>
      White text on red background on viewport with width > 2000px.
    </div>
  </main>
</template>

<style>
#pre-rendered {
  color: red;
  background: wheat;
}

@media screen and (min-width: 1000px) {
  #pre-rendered {
    color: lightblue;
    background: darkmagenta;
  }
}

@media screen and (min-width: 2000px) {
  #pre-rendered {
    background: red;
    color: white;
    position: relative;
    top: 10px;
    right: 10px;
    z-index: 99999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px 10px 10px 10px;
  }
}
</style>
