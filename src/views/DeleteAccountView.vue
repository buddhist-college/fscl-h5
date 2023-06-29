<script setup lang="ts">
  import { ref } from 'vue'
  import { ErrorMsg } from '@/common/config'
  import { showToast } from '@/common/globalToast'
  import ConfirmModal from '@/common/confirmModal/ConfirmModal.vue'
  import { deleteAccount } from '@/services/userService'
  import fsclLogo from '@/assets/images/fscl_logo.png'
  import userAvatar from '@/assets/images/user_ava_default_big.png'
  import userUicon from '@/assets/images/user_uicon.png'
  import userLock from '@/assets/images/user_lock.png'
  import userRigCeye from '@/assets/images/user_rig_ceye.png'
  import userRigOpeye from '@/assets/images/user_rig_opeye.png'

  const showPassword = ref(false)
  const showConfirm = ref(false)
  const showMessage = ref(false)
  const username = ref('')
  const password = ref('')
  
  function handleSubmit (e: Event) {
    e.preventDefault()
    if (username.value.trim() && password.value.trim()) {
      showConfirm.value = true
    } else {
      showToast(ErrorMsg.loginInfoRequired)
    }
  }

  async function handleRequest () {
    showConfirm.value = false
    const data = await deleteAccount({
      userName: username.value.trim(),
      passWord: password.value.trim(),
    })
    if (data) {
      showMessage.value = true
    }
  }

  function handleReload () {
    window.location.reload()
  }
</script>

<template>
  <div class="deleteAccount">
    <header>
      <img width="70" height="24" :src="fsclLogo" />
    </header>
    <div class="content">
      <div class="avatar">
        <img width="68" height="68" :src="userAvatar">
        <p>APP帳號刪除申請</p>
      </div>
      <div class="warning">
        <div>您正在進行註銷帳號操作，請關注以下風險</div>
        <p>1、帳號註銷後您所訂閱的內容不再保留</p>
        <p>2、帳號註銷後您所收藏的內容不再保留</p>
        <p>3、帳號註銷後數據不可恢復，請謹慎操作</p>
      </div>
      <form class="form" @submit="handleSubmit">
        <div class="formItem">
          <img width="20" height="20" :src="userUicon" />
          <input v-model="username" placeholder="請輸入用戶名" />
        </div>
        <div class="formItem">
          <img width="20" height="20" :src="userLock" />
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="請輸入密碼"  />
          <img width="20" height="20" :src="showPassword ? userRigCeye : userRigOpeye" @click="showPassword = !showPassword">
        </div>
        <button class="button" type="submit">註銷賬號並刪除數據</button>
      </form>
    </div>
  </div>
  <ConfirmModal
    :open="showConfirm"
    title="您正在進行帳號註銷操作"
    content="帳號註銷後數據不可恢復，請謹慎操作"
    firstBtnText="確認註銷"
    firstBtnType="primary"
    secondBtnText="取消"
    :handleFirstBtnClick="handleRequest"
    :handleSecondBtnClick="() => showConfirm = false"
  />
  <ConfirmModal
    :open="showMessage"
    title="帳號已註銷，感恩使用"
    firstBtnText="確認"
    firstBtnType="primary"
    :handleFirstBtnClick="() => handleReload()"
  />
</template>

<style scoped lang="less">
.deleteAccount {
  height: 100vh;
  background: linear-gradient(160deg, rgba(236,224,208,0.9) 0%, rgba(255,255,255,0.9) 100%);
  backdrop-filter: blur(5px);
}
header {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 0 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  margin-top: 52px;
  text-align: center;
  p {
    margin: 10px 0;
    font-size: 14px;
    color: #101010;
  }
}
.warning {
  margin-top: 30px;
  font-size: 16px;
  line-height: 24px;
  div {
    margin-top: 14px;
  }
  p {
    margin: 5px 0;
  }
}
.form {
  margin-top: 40px;
  width: 100%;
  .formItem {
    height: 50px;
    display: flex;
    gap: 20px;
    align-items: center;
    box-shadow: inset 0px -1px 0px 0px rgba(152,123,103,0.1);
    &:last-of-type {
      margin-top: 10px;
    }
  }
  input {
    flex: 1;
    border: none;
    background-color: transparent;
    font-size: 14px;
    line-height: 18px;
    outline: none;
  }
}
.button {
  margin-top: 20px;
  background: #987B67;
  border-radius: 4px;
  width: 100%;
  height: 50px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
</style>