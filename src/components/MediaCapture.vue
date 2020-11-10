<template>
  <div class="fullscreen window-height window-width bg-black">
    <video
      ref="preview"
      class="camera-preview"
      :class="{ mirror: facingMode === 'user' }"
      muted
    />
    <canvas ref="canvas" id="canvas" />
    <q-dialog v-model="mediaPreview" @hide="discardMedia">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-img :src="dataURL" width="100%" v-if="type === 'picture'" />
        <q-video :ratio="16 / 9" :src="dataURL" v-else />
        <q-card-actions>
          <q-btn @click="confirmMedia" flat v-close-popup>OK</q-btn>
          <q-btn @click="discardMedia" flat v-close-popup>Ponów</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky
      class="q-gutter-sm"
      position="bottom"
      :offset="[0, 18]"
      expand
    >
      <q-btn
        @click="capture"
        color="primary"
        :icon="captureIcon"
        size="xl"
        round
      />
      <q-btn
        @click="switchCamera"
        color="secondary"
        size="lg"
        icon="switch_camera"
        round
      />
    </q-page-sticky>
    <q-page-sticky position="top-right" :offset="[18, -50 + 18]">
      <q-btn color="white" icon="clear" @click="close" round flat />
    </q-page-sticky>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: 'picture'
    }
  },
  data () {
    return {
      wasLeftDrawerOpen: true,
      videoTrack: null,
      facingMode: 'environment',
      width: 0,
      height: 0,
      dataURL: null,
      blob: null,
      mediaPreview: false,
      videoData: [],
      videoRecorder: null,
      isRecording: false
    }
  },
  computed: {
    ...mapGetters({
      leftDrawerOpen: 'leftDrawerOpen'
    }),
    captureIcon () {
      if (this.type === 'picture') {
        return 'camera'
      }
      if (this.isRecording) {
        return 'stop'
      }
      return 'videocam'
    }
  },
  methods: {
    ...mapMutations(['hideLeftDrawer', 'openLeftDrawer']),
    close () {
      this.$emit('close')
    },
    startPreview () {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: this.facingMode
          }
        })
        .then((stream) => {
          this.$refs.preview.srcObject = stream
          this.$refs.preview.captureStream =
            this.$refs.preview.captureStream ||
            this.$refs.preview.mozCaptureStream
          const videoTracks = stream.getVideoTracks()
          if (videoTracks.length) {
            this.videoTrack = videoTracks[0]
          }

          this.$refs.preview.onloadeddata = () => {
            this.$refs.preview.play()
          }
        })
    },
    stopPreview () {
      if (this.videoTrack) {
        this.videoTrack.stop()
      }
      this.videoTrack = null
      this.$refs.preview.srcObject = null
    },

    switchCamera () {
      const facingMode = this.videoTrack.getConstraints().facingMode
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
      this.stopPreview()
      this.facingMode = newFacingMode
      this.startPreview()
    },

    clearPicture () {
      this.imageData = null
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.fillStyle = '#AAA'
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
    },

    takePicture () {
      const ctx = this.$refs.canvas.getContext('2d')
      if (this.width && this.height) {
        this.$refs.canvas.width = this.width
        this.$refs.canvas.height = this.height
        ctx.drawImage(this.$refs.preview, 0, 0, this.width, this.height)

        this.dataURL = this.$refs.canvas.toDataURL('image/jpeg')
        this.$refs.canvas.toBlob((blob) => {
          this.blob = blob
          this.mediaPreview = true
        }, 'image/jpeg')
      }
    },
    capture () {
      if (this.type === 'picture') {
        this.takePicture()
      } else if (!this.isRecording) {
        this.recordVideo()
      } else {
        this.stopRecording()
      }
    },
    recordVideo () {
      const stream = this.$refs.preview.captureStream()
      this.videoRecorder = new MediaRecorder(stream)
      this.videoData = []
      this.isRecording = true

      this.videoRecorder.ondataavailable = (event) => {
        console.log('MediaRecorder data available', event.data)
        this.videoData.push(event.data)
        console.log(this.videoData)
      }
      this.videoRecorder.onstart = () => {
        console.log('Video recorder starter')
      }

      this.videoRecorder.onstop = () => {
        console.log('Video recorder stop')
      }

      this.videoRecorder.onerror = (e) => {
        console.error(e)
      }
      this.videoRecorder.start()
    },
    stopRecording () {
      if (this.videoRecorder) {
        this.videoRecorder.stop()
        this.isRecording = false
        this.videoRecorder.onstop = () => {
          const recordedBlob = new Blob(this.videoData, { type: 'video/webm' })
          const reader = new FileReader()
          reader.onloadend = () => {
            this.blob = recordedBlob
            this.dataURL = reader.result
            this.mediaPreview = true
          }
          reader.readAsDataURL(recordedBlob)
        }
      }
    },
    confirmMedia () {
      this.$emit('snap', {
        blob: this.blob,
        dataURL: this.dataURL
      })
      this.close()
    },

    discardMedia () {
      this.clearPicture()
    }
  },
  created () {
    // beforeEach zwraca metodę, która usuwa strażnika routera
    const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
      // nie chcemy, aby kliknięcie wstecz spowodowało cofnięcie w historii.
      // Chcemy tylko zamknąć okno
      this.close()
      next(false)
    })

    // hook przed zniszczeniem komponentu - usuwamy strażnika
    this.$once('hook:destroyed', () => {
      unregisterRouterGuard()
    })

    this.startPreview()
  },
  mounted () {
    this.wasLeftDrawerOpen = this.leftDrawerOpen
    if (this.leftDrawerOpen) this.hideLeftDrawer()
    this.$refs.preview.addEventListener('canplay', (ev) => {
      this.height = this.$refs.preview.videoHeight
      this.width = this.$refs.preview.videoWidth
      this.$refs.canvas.setAttribute('width', this.width)
      this.$refs.canvas.setAttribute('height', this.height)
    })
  },
  beforeDestroy () {
    this.stopPreview()
    if (this.wasLeftDrawerOpen) this.openLeftDrawer()
  }
}
</script>
<style lang="scss" scoped>
.camera-preview {
  display: block;
  object-fit: cover;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
}
.camera-preview.mirror {
  transform: scaleX(-1);
}

#canvas {
  display: none;
}
</style>
