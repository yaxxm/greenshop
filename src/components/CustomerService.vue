<template>
  <div>
    <!-- 客服按钮 -->
    <div 
      v-if="!isOpen" 
      class="customer-service-btn"
      @click="openChat"
      :style="{ left: btnPosition.x + 'px', top: btnPosition.y + 'px' }"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
    >
      <el-icon size="24"><ChatDotRound /></el-icon>
    </div>

    <!-- 聊天窗口 -->
    <div 
      v-if="isOpen" 
      class="chat-window"
      :style="{ left: windowPosition.x + 'px', top: windowPosition.y + 'px' }"
    >
      <!-- 窗口头部 -->
      <div 
        class="chat-header"
        @mousedown="startWindowDrag"
        @mousemove="onWindowDrag"
        @mouseup="stopWindowDrag"
      >
        <span>AI客服助手</span>
        <el-button 
          type="text" 
          @click="closeChat"
          class="close-btn"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="chatContent">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', message.type]"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.time) }}
          </div>
        </div>
        <div v-if="isLoading" class="message ai">
          <div class="message-content loading">
            <span>AI正在思考中...</span>
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        >
          <template #append>
            <el-button 
              type="primary" 
              @click="sendMessage"
              :disabled="isLoading || !inputMessage.trim()"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ChatDotRound, Close } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 组件状态
const isOpen = ref(false)
const inputMessage = ref('')
const isLoading = ref(false)
const messages = ref([])
const chatContent = ref(null)

// 拖拽相关状态
const isDragging = ref(false)
const isWindowDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const windowDragOffset = reactive({ x: 0, y: 0 })

// 位置状态
const btnPosition = reactive({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
const windowPosition = reactive({ x: window.innerWidth - 400, y: 100 })

// Kimi API配置
const KIMI_API_KEY = 'sk-7a98f4c864f6448fa113cfde8e9fe619'
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

// 打开聊天窗口
const openChat = () => {
  if (!isDragging.value) {
    isOpen.value = true
    // 添加欢迎消息
    if (messages.value.length === 0) {
      messages.value.push({
        type: 'ai',
        content: '您好！我是AI客服助手，有什么可以帮助您的吗？',
        time: new Date()
      })
    }
  }
}

// 关闭聊天窗口
const closeChat = () => {
  isOpen.value = false
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = {
    type: 'user',
    content: inputMessage.value,
    time: new Date()
  }
  
  messages.value.push(userMessage)
  const question = inputMessage.value
  inputMessage.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 调用Kimi API
  await callKimiAPI(question)
}

// 调用Kimi API - 流式输出
const callKimiAPI = async (question) => {
  isLoading.value = true
  
  // 创建AI消息对象，初始内容为空
  const aiResponse = {
    type: 'ai',
    content: '',
    time: new Date()
  }
  
  messages.value.push(aiResponse)
  const messageIndex = messages.value.length - 1
  isLoading.value = false
  
  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的客服助手，请用友好、专业的语气回答用户的问题。'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true // 启用流式输出
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          if (data === '[DONE]') {
            return
          }
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            
            if (content) {
              messages.value[messageIndex].content += content
              await nextTick()
              scrollToBottom()
            }
          } catch (e) {
            // 忽略解析错误，继续处理下一行
            continue
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Kimi API调用失败:', error)
    
    // 如果流式调用失败，回退到普通调用
    await fallbackToNormalAPI(question, messageIndex)
  }
}

// 回退到普通API调用
const fallbackToNormalAPI = async (question, messageIndex) => {
  try {
    const response = await axios.post(KIMI_API_URL, {
      model: 'moonshot-v1-8k',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的客服助手，请用友好、专业的语气回答用户的问题。'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    const fullContent = response.data.choices[0].message.content
    
    // 清空之前的内容，使用打字机效果
    messages.value[messageIndex].content = ''
    await typewriterEffect(fullContent, messageIndex)
    
  } catch (error) {
    console.error('回退API调用也失败:', error)
    
    messages.value[messageIndex].content = '抱歉，服务暂时不可用，请稍后再试。'
    ElMessage.error('AI服务连接失败')
  }
}

// 打字机效果函数
const typewriterEffect = async (text, messageIndex) => {
  const delay = 30 // 每个字符的延迟时间（毫秒）
  
  for (let i = 0; i <= text.length; i++) {
    messages.value[messageIndex].content = text.slice(0, i)
    
    // 每次更新后滚动到底部
    await nextTick()
    scrollToBottom()
    
    // 延迟
    if (i < text.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (time) => {
  return time.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 按钮拖拽功能
const startDrag = (e) => {
  isDragging.value = true
  dragOffset.x = e.clientX - btnPosition.x
  dragOffset.y = e.clientY - btnPosition.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  const newX = e.clientX - dragOffset.x
  const newY = e.clientY - dragOffset.y
  
  // 限制在窗口范围内
  btnPosition.x = Math.max(0, Math.min(window.innerWidth - 60, newX))
  btnPosition.y = Math.max(0, Math.min(window.innerHeight - 60, newY))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 窗口拖拽功能
const startWindowDrag = (e) => {
  isWindowDragging.value = true
  windowDragOffset.x = e.clientX - windowPosition.x
  windowDragOffset.y = e.clientY - windowPosition.y
  document.addEventListener('mousemove', onWindowDrag)
  document.addEventListener('mouseup', stopWindowDrag)
  e.preventDefault()
}

const onWindowDrag = (e) => {
  if (!isWindowDragging.value) return
  
  const newX = e.clientX - windowDragOffset.x
  const newY = e.clientY - windowDragOffset.y
  
  // 限制在窗口范围内
  windowPosition.x = Math.max(0, Math.min(window.innerWidth - 380, newX))
  windowPosition.y = Math.max(0, Math.min(window.innerHeight - 500, newY))
}

const stopWindowDrag = () => {
  isWindowDragging.value = false
  document.removeEventListener('mousemove', onWindowDrag)
  document.removeEventListener('mouseup', stopWindowDrag)
}

// 监听窗口大小变化
onMounted(() => {
  const handleResize = () => {
    // 确保按钮和窗口在可见范围内
    btnPosition.x = Math.min(btnPosition.x, window.innerWidth - 60)
    btnPosition.y = Math.min(btnPosition.y, window.innerHeight - 60)
    windowPosition.x = Math.min(windowPosition.x, window.innerWidth - 380)
    windowPosition.y = Math.min(windowPosition.y, window.innerHeight - 500)
  }
  
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.customer-service-btn {
  position: fixed;
  width: 60px;
  height: 60px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  z-index: 9999;
  transition: all 0.3s ease;
  user-select: none;
}

.customer-service-btn:hover {
  background: #337ecc;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.chat-window {
  position: fixed;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #409eff;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  font-weight: 500;
}

.close-btn {
  color: white !important;
  padding: 0 !important;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.chat-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.ai {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
}

.message.user .message-content {
  background: #409eff;
  color: white;
}

.message.ai .message-content {
  background: white;
  color: #333;
  border: 1px solid #e4e7ed;
}

.message-content.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e4e7ed;
}

/* 滚动条样式 */
.chat-content::-webkit-scrollbar {
  width: 6px;
}

.chat-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>