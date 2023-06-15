import { ErrorMsg } from "@/common/config"
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
  swarmId: string;
  videoHlsUrl: string;
  poster: string;
}

export const getLiveChannel = async () => {
  try {
    const res = await (await fetch('https://work.hwadzan.org/api/hwadzan/v2/live')).json()
    return res.channelinfo.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      currentPlaylist: v.currentPlaylist,
      playlist: v.playlist,
      swarmId: v.swarmId,
      videoHlsUrl: v.videoHlsUrl,
      poster: v.poster,
    })) as ChannelData[]
  } catch(err) {
    showToast(ErrorMsg.common)
    return []
  }
}
