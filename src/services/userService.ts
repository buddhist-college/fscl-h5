import fetch from '@/common/fetch'

interface DeleteAccountReq {
  userName: string
  passWord: string
}

export const deleteAccount = async ({ userName, passWord }: DeleteAccountReq) => {
  try {
    return await fetch<boolean>('/app/account/h5/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({
        userName,
        passWord
      }),
    })
  } catch(err) {
    return null
  }
}