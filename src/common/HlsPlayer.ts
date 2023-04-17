import Hls from 'hls.js'

const p2pmlCore = (window as any).p2pml.core
const p2pmlHlsjs = ((window as any).p2pml).hlsjs

interface Props {
  videoSrc: string
  swarmId: string
  trackers: string[]
  videoEl: HTMLVideoElement | null
}

class HlsPlayer {
  static readonly hlsJsSupport = Hls.isSupported()
  static readonly p2pSupport = !!p2pmlHlsjs.Engine.isSupported()
  static readonly nativeHlsSupport = function() {
    const video = document.createElement('video')
    return !!video.canPlayType('application/vnd.apple.mpegurl')
  }()
  static readonly hlsSupport = HlsPlayer.hlsJsSupport || HlsPlayer.nativeHlsSupport

  props: Props = {
    videoSrc: '',
    swarmId: '',
    trackers: [],
    videoEl: null,
  }

  private hls: Hls | null = null

  readonly statistics = {
    totalDownload: 0,
    httpDownload: 0,
    p2pDownload: 0,
    totalUpload: 0,
  }
  readonly peers = new Map<string, string>()

  constructor(props?: Partial<Props>) {
    this.mergeProps(props)
  }

  private get statisticsLog() {
    return 'Download:' + (this.statistics.totalDownload / 1048576).toFixed(2) + 'M' + ' (' +
    'Http:' + (this.statistics.httpDownload / 1048576).toFixed(2) + 'M ' + (100 * this.statistics.httpDownload / this.statistics.totalDownload).toFixed() + '%' + ' | ' +
    'P2P:' + (this.statistics.p2pDownload / 1048576).toFixed(2) + 'M ' + (100 * this.statistics.p2pDownload / this.statistics.totalDownload).toFixed() + '%' + ') ' +
    'Upload:' + (this.statistics.totalUpload / 1048576).toFixed(2) + 'M '
  }

  private mergeProps(props?: Partial<Props>) {
    if (props) {
      Object.keys(props).map(v => {
        const key = v as keyof Props
        this.props[key] = props[key] as any
      })
    }
  }

  init(props?: Partial<Props>) {
    if (
      props && props.videoSrc && props.swarmId && 
      (this.props.videoSrc !== props.videoSrc || this.props.swarmId !== props.swarmId)
    ) {
      this.mergeProps(props)
      this.initHls()
      this.loadHlsData()
      this.initVideo()
    }
  }

  loadHlsData() {
    if (HlsPlayer.hlsJsSupport) {
      if (this.hls) {
        this.hls.loadSource(this.props.videoSrc)
      }
    }
  }

  initVideo() {
    if (this.props.videoEl) {
      if (HlsPlayer.hlsJsSupport) {
        if (this.hls) {
          this.hls.attachMedia(this.props.videoEl)
        }
      } else if (HlsPlayer.nativeHlsSupport) {
        this.props.videoEl.src = this.props.videoSrc
      }
    }
  }

  initHls() {
    if (!this.props.swarmId || !this.props.trackers) {
      return
    }
    if (HlsPlayer.hlsJsSupport) {
      let hls
      if (HlsPlayer.p2pSupport) {
        const config = {
          segments: {
            swarmId: this.props.swarmId,
          },
          loader: {
            trackerAnnounce: this.props.trackers,
            rtcConfig: {
              iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:global.stun.twilio.com:3478" },
              ],
            },
          },
        }
        console.log(config)
        const engine = new p2pmlHlsjs.Engine(config)
        engine.on(p2pmlCore.Events.PieceBytesDownloaded, (method: any, segment: any, bytes: any) => {
          this.statistics.totalDownload += bytes
          if (method == "http") this.statistics.httpDownload += bytes
          if (method == "p2p") this.statistics.p2pDownload += bytes
          console.log(this.statisticsLog)
        })
        engine.on(p2pmlCore.Events.PieceBytesUploaded, (method: any, segment: any, bytes: any) => {
          this.statistics.totalUpload += bytes
          console.log(this.statisticsLog)
        })
        engine.on(p2pmlCore.Events.PeerConnect, (peer: any) => {
          this.peers.set(peer.id, peer.remoteAddress)
          console.log('Peers: ', this.peers)
        })
        engine.on(p2pmlCore.Events.PeerClose, (peer: any) => {
          if (this.peers.has(peer.id)) {
            this.peers.delete(peer.id)
            console.log('Peers: ', this.peers)
          }
        })
        engine.on(p2pmlCore.Events.SegmentError, function (segment: any, error: any, peerId: any) {
          console.log("SegmentError: ", segment, error, peerId)
        })
        hls = new Hls({
          liveSyncDurationCount: 6,
          loader: engine.createLoaderClass(),
        });
        p2pmlHlsjs.initHlsJsPlayer(hls)
      } else {
        hls = new Hls({
          liveSyncDurationCount: 6,
        })
      }
      this.hls = hls
      return hls
    } else {
      this.hls = null
      return null
    }
  }
}

export default HlsPlayer