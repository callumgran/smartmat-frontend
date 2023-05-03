<template>
  <div>
    <div class="video-text">
      <h1>SmartMat</h1>
      <h3>Vær matsmart med SmartMat</h3>
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

<style>
#background-video {
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  background-size: cover;
  filter: brightness(0.8);
  z-index: -10;
  max-height: 90vh;
  object-fit: cover;
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

.video-text * {
  z-index: 10;
  color: white;
}
</style>
