import Hls from 'hls.js'

const p2pmlCore = (window as any).p2pml.core
const p2pmlHlsjs = ((window as any).p2pml).hlsjs

interface Props {
  videoSrc: string
  useP2P: boolean
  swarmId: string
  segmentValidatorUrl: string
  trackers: string[]
  videoEl: HTMLVideoElement | null
}

const hlsOptions = {
  manifestLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: Infinity,
      maxLoadTimeMs: 20000,
      timeoutRetry: {
        maxNumRetry: 3,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
      },
      errorRetry: {
        maxNumRetry: 6,
        retryDelayMs: 3000,
        maxRetryDelayMs: 10000,
      },
    },
  },
  playlistLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 10000,
      maxLoadTimeMs: 20000,
      timeoutRetry: {
        maxNumRetry: 3,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
      },
      errorRetry: {
        maxNumRetry: 10,
        retryDelayMs: 3000,
        maxRetryDelayMs: 10000,
      },
    },
  },
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 10000,
      maxLoadTimeMs: 120000,
      timeoutRetry: {
        maxNumRetry: 3,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
      },
      errorRetry: {
        maxNumRetry: 6,
        retryDelayMs: 3000,
        maxRetryDelayMs: 10000,
      },
    },
  },
  liveDurationInfinity: true,
  liveSyncDurationCount: 6, // To have at least 6 segments in queue
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
    useP2P: true,
    swarmId: '',
    segmentValidatorUrl: '',
    trackers: [],
    videoEl: null,
  }

  private hls: Hls | null = null
  private engine: any = null

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
        this.props[key] = props[key] as never
      })
    }
  }

  private segmentValidator = async (Segment: any, method: any, peerId: any) => {
    // console.log(method, peerId, Segment);
    if (method == "p2p") {
      // Use the Web Crypto API's subtle.digest method
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', Segment.data);

      // Convert the ArrayBuffer hash to a Uint8Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      // Convert each byte to its hexadecimal representation and join them
      const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const p2pdata = "" + Segment.id + '+' + Segment.data.byteLength + '+' + hexHash + '+' + peerId;

      // console.log(id + '+' + length + '+' + hexHash + '+' + peerId);
      return new Promise((resolve, reject) => {
          fetch(this.props.segmentValidatorUrl+'?swarmids='+p2pdata, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          })
            .then(function (response) {
                // console.log(response);
                if (response.ok) {
                    return response.json();
                }else{
                    console.log(method + ' ' + p2pdata + ' ' + '網路錯誤，無法驗證結果');
                    reject("網路錯誤，無法驗證結果");                                                  
                }
            })
            .then(function (myJson) {
                if(myJson.result == "OK") {
                    // 下面這一行正式環境註釋掉（這裡打印是看看是否正常）
                    // console.log(method + ' ' + p2pdata + ' ' + myJson.message);
                    resolve(myJson.message);
                } else {
                    console.log(method + ' ' + p2pdata + ' ' + myJson.message);
                    reject(myJson.message);
                }                                              
            })
            .catch(function (error) {
                console.log(method + ' ' + p2pdata + ' ' + '無法驗證結果,錯誤原因：' + error.message);
                reject("無法驗證結果,錯誤原因："+error.message);
            });
      });
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
      let hls: Hls
      if (HlsPlayer.p2pSupport) {
        const config = {
          segments: {
            swarmId: this.props.swarmId,
          },
          loader: {
            useP2P: this.props.useP2P,
            trackerAnnounce: this.props.trackers,
            httpDownloadProbability: 0.05,
            segmentValidator: this.segmentValidator,
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
        this.engine = engine
        hls = new Hls({
          ...hlsOptions,
          loader: engine.createLoaderClass(),
        });
        p2pmlHlsjs.initHlsJsPlayer(hls)
      } else {
        hls = new Hls({
          ...hlsOptions,
          loader: Hls.DefaultConfig.loader,
        })
      }
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('fatal network error encountered', data)
              if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT || data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                this.loadHlsData()
              } else {
                hls.startLoad()
              }
            break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover', data)
              hls.recoverMediaError()
            break;
            default:
              console.error("cannot recover", data)
              // hls.destroy()
            break;
          }
        }
      })
      this.hls = hls
      return hls
    } else {
      this.hls = null
      return null
    }
  }

  destroy() {
    if (HlsPlayer.hlsJsSupport) {
      if (HlsPlayer.p2pSupport) {
        if (this.engine) {
          this.engine.destroy()
        }
      }
      if (this.hls) {
        this.hls.destroy()
      }
    }
  }
}

export default HlsPlayer