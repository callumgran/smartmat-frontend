<template>
  <div class="wrapper">
    <div class="video-text">
      <h1>SmartMat</h1>
      <h3>Vær matsmart med SmartMat</h3>
      <br />
      <v-btn @click="$router.push({ name: 'register' })" class="register-btn">
        registrer deg
      </v-btn>
    </div>

    <video
      ref="vid"
      id="background-video"
      src="/landingPageVideo.mp4"
      autoplay
      playsinline
      loop
      muted></video>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#background-video {
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  background-size: cover;
  object-fit: cover;
  filter: brightness(0.7);
}

.video-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0;
}

.v-main {
  background-color: transparent !important;
}

.v-application {
  background-color: transparent !important;
}
.video-text h3,
h1 {
  z-index: 10;
  color: white;
}
</style>
