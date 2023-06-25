<template>
  <div class="z-tpl-editor-container">
    <div
      ref="editorContentRef"
      class="z-tpl-editor-container__editor"
      :id="contentId"
      @click="inputClick($event)"
      @keydown.delete="handleDelete($event)"
      @input="handleInput($event.target)"
    ></div>
    <div class="z-tpl-editor-container_tools">
      <button
        class="z-tpl-editor-container_tools__item"
        @click="$emit('add', 'link')"
      >
        添加超链接
      </button>
      <button
        class="z-tpl-editor-container_tools__item"
        @click="$emit('add', 'tag')"
      >
        添加模版标签
      </button>
      <span
        v-if="maxLength"
        :class="[
          'z-tpl-editor-container_tools__text',
          typingCount.remainQuantity < 0 ? '__danger' : '',
        ]"
        >{{ typingCount.tips }}</span
      >
    </div>
  </div>
</template>
<script lang="js">
import {computed, defineComponent, onMounted, onUnmounted, ref} from "vue";

export default defineComponent({
  name: 'TplEditor',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: ' '
    },
    maxLength: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['update:modelValue', 'add', 'edit'],
  setup(props, {emit}) {
    const guid = () => {
      return `${Date.now()}-${Math.ceil(Math.random() * 1000)}`;
    }

    const contentId = `content${guid()}`
    const editorContentRef = ref(null)
    const currentTextLength = ref(0)
    const isLocked = ref(false)
    const currentTagId = ref(null)
    const selectedRange = ref(null)
    const handlerSelection = () => {
      const selection = window.getSelection()
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
      if (range && contentId === range.commonAncestorContainer.ownerDocument.activeElement.id) {
        selectedRange.value = range
      }
    }

    const updateData = (html, text) => {
      currentTextLength.value = text?.length ?? 0
      emit('update:modelValue', html)
    }

    const pushTagToContent = (tag) => {
      const container = editorContentRef.value
      if (selectedRange.value) {
        selectedRange.value.deleteContents();
        selectedRange.value.insertNode(tag)
      } else {
        container.appendChild(tag)
      }
      updateData(container.innerHTML + ' ', container.innerText)
    }

    const handleInput = (tag) => {
      updateData(tag.innerHTML, tag.innerText);
    }

    const inputClick = (e) => {
      isLocked.value = true
      const tagName = e.target.nodeName
      if (tagName.toLowerCase() === 'placeholder') {
        currentTagId.value = e.target.id
        e.target.className = 'active'
      } else if (currentTagId.value) {
        const selectedTag = document.getElementById(currentTagId.value)
        selectedTag.className = ''
        currentTagId.value = null
      } else {
        currentTagId.value = null
      }
    }

    const handleDelete = (e) => {
      if (currentTagId.value) {
        const selectedTag = document.getElementById(currentTagId.value)
        editorContentRef.value.removeChild(selectedTag)
        currentTagId.value = null
        e.preventDefault()
        handleInput(e.target)
      }
    }

    const maxLength = Number(props.maxLength)
    const typingCount = computed(() => {
      if (maxLength) {
        const remainQuantity =  maxLength - currentTextLength.value
        const tips = remainQuantity <= 0 ? `输入文字已超出最大值${maxLength},${Math.abs(remainQuantity)}个字` : `还可以输入${remainQuantity}个字符`
        return {remainQuantity, tips}
      }
      return null
    })

    onMounted(() => {
      editorContentRef.value.innerHTML = props.modelValue || ''
      document.addEventListener('selectionchange', handlerSelection, {passive: false, capture: false});
    })

    onUnmounted(() => {
      document.removeEventListener('selectionchange', handlerSelection);
    })

    const createTagElement = (text, parent) => {
      const eleTag = document.createElement('placeholder')
      eleTag.innerText = text
      eleTag.id = `ph-${guid()}`
      eleTag.ondblclick = () => {
        const editId = parent ? parent.id : eleTag.id
        emit('edit', editId, eleTag.innerText, parent?.href ?? '')
      }
      return eleTag
    }

    const appendChild = ({id, type, text, url}) => {
      if (id) {
        const editTag = document.getElementById(id)
        editorContentRef.value.removeChild(editTag)
      }
      if (type === 'link') {
        const eleLink = document.createElement('a')
        eleLink.href = url
        eleLink.target = 'blank'
        eleLink.id = `link${guid()}`
        const eleTag = createTagElement(text, eleLink)
        eleLink.appendChild(eleTag)
        pushTagToContent(eleLink)
      } else {
        const eleTag = createTagElement(text)
        pushTagToContent(eleTag)
      }
    }

    return {
      appendChild,
      inputClick,
      handleDelete,
      handleInput,
      editorContentRef,
      contentId,
      isLocked: false,
      typingCount
    }
  }
})
</script>

<style lang="scss">
@import "./tpl-editor.scss";
</style>
