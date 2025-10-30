import i18n from '@/locales'
import { showToast } from "@/common/globalToast"

export interface ChannelData {
  id: number;
  name: string;
  description: string;
  currentPlaylist: {
    description: string;
    flushtime: number;
    now: string;
    subject: string;
  };
  playlist: {
    active: number;
    description: number;
    endTime: string;
    endTimeShort: string;
    startTime: string;
    startTimeShort: string;
    subject: string;
  }[];
  useP2P: boolean;
  swarmId: string;
  videoHlsUrl: string;
  poster: string;
  audioHlsUrl: string;
  segmentValidatorUrl: string;
}

export const getLiveChannel = async () => {
  try {
    const res = await (await fetch('https://work.hwadzan.org/api/hwadzan/v2/live', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': i18n.global.locale.value === 'zh-CN' ? 'zh-Hans' : 'zh-Hant',
      },
    })).json()
    return res.channelinfo.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      currentPlaylist: v.currentPlaylist,
      playlist: v.playlist,
      useP2P: v.useP2P,
      swarmId: v.swarmId,
      videoHlsUrl: v.videoHlsUrl,
      poster: v.poster,
      audioHlsUrl: v.audioHlsUrl,
      segmentValidatorUrl: v.segmentValidatorUrl,
    })) as ChannelData[]
  } catch(err) {
    showToast(i18n.global.t('errorMsg.common'))
    return []
  }
}
