<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { showToast } from '@/common/globalToast'
  import ConfirmModal from '@/common/confirmModal/ConfirmModal.vue'
  import { deleteAccount } from '@/services/userService'
  import fsclLogo from '@/assets/images/fscl_logo.png'
  import userAvatar from '@/assets/images/user_ava_default_big.png'
  import userUicon from '@/assets/images/user_uicon.png'
  import userLock from '@/assets/images/user_lock.png'
  import userRigCeye from '@/assets/images/user_rig_ceye.png'
  import userRigOpeye from '@/assets/images/user_rig_opeye.png'

  const { t } = useI18n()
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
      showToast(t('errorMsg.loginInfoRequired'))
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
        <p>{{ t('deleteAccount.apply') }}</p>
      </div>
      <div class="warning">
        <div>{{ t('deleteAccount.riskTitle') }}</div>
        <p>{{ t('deleteAccount.riskList.0') }}</p>
        <p>{{ t('deleteAccount.riskList.1') }}</p>
        <p>{{ t('deleteAccount.riskList.2') }}</p>
      </div>
      <form class="form" @submit="handleSubmit">
        <div class="formItem">
          <img width="20" height="20" :src="userUicon" />
          <input v-model="username" :placeholder="t('deleteAccount.placeholderUsername')" />
        </div>
        <div class="formItem">
          <img width="20" height="20" :src="userLock" />
          <input v-model="password" :type="showPassword ? 'text' : 'password'" :placeholder="t('deleteAccount.placeholderPassword')"  />
          <img width="20" height="20" :src="showPassword ? userRigCeye : userRigOpeye" @click="showPassword = !showPassword">
        </div>
        <button class="button" type="submit">{{ t('deleteAccount.submit') }}</button>
      </form>
    </div>
  </div>
  <ConfirmModal
    :open="showConfirm"
    :title="t('deleteAccount.confirm')"
    :content="t('deleteAccount.confirmContent')"
    :firstBtnText="t('deleteAccount.confirmSubmit')"
    firstBtnType="primary"
    :secondBtnText="t('deleteAccount.confirmCancel')"
    :handleFirstBtnClick="handleRequest"
    :handleSecondBtnClick="() => showConfirm = false"
  />
  <ConfirmModal
    :open="showMessage"
    :title="t('deleteAccount.confirmSuccess')"
    :firstBtnText="t('deleteAccount.confirmSuccessSubmit')"
    firstBtnType="primary"
    :handleFirstBtnClick="() => handleReload()"
  />
</template>

<style scoped lang="less">
.deleteAccount {
  height: var(--100vh, 100vh);
  overflow: hidden;
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